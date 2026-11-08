
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import { useNavigate, useParams } from "react-router-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import {
  ArrowLeft,
  Wrench,
  ChevronDown,
  MapPin,
  Search,
  Navigation,
  CheckCircle2,
  CalendarDays,
  Clock,
  ImagePlus,
  Camera,
  X,
  Send,
  Loader2,
} from "lucide-react";

import { useToast } from "../../../Context/ToastContext";
import getCookie from "../../../utils/getToken";
import { API_BASE_URL } from "../../../utils/api";

const PHOTON_URL = "https://photon.komoot.io/api/";

const MAX_IMAGES = 5;
const MAX_DESCRIPTION_LENGTH = 500;

// =========================
// FORMAT HELPERS
// =========================

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${day}-${month}-${date.getFullYear()}`;
};

const normalizeAddress = (value) =>
  String(value || "")
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const formatAddress = (properties = {}) => {
  const parts = [
    properties.name,
    properties.housenumber,
    properties.street,
    properties.suburb,
    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim());

  return [...new Set(parts)].join(", ");
};

const getServiceId = (service) =>
  service?.id_service ??
  service?.idService ??
  service?.service_id ??
  service?.serviceId ??
  service?.id;

const getServiceName = (service) =>
  service?.service_name ??
  service?.nameService ??
  service?.name ??
  service?.title ??
  "Dịch vụ";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const rad = (value) => (value * Math.PI) / 180;
  const earthRadius = 6371;

  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) *
      Math.sin(dLon / 2) ** 2;

  return (
    earthRadius *
    2 *
    Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  );
};

// =========================
// MAIN COMPONENT
// =========================

export default function BookingTechnicianForm() {
  const navigate = useNavigate();
  const { idTech } = useParams();
  const { showToast } = useToast();

  const calendarRef = useRef(null);
  const mountedRef = useRef(false);
  const searchRequestRef = useRef(0);

  // =========================
  // STATE
  // =========================

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  const [serviceLoading, setServiceLoading] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  // ADDRESS
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [currentPosition, setCurrentPosition] = useState(null);

  const [addressResults, setAddressResults] = useState([]);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // DESCRIPTION
  const [description, setDescription] = useState("");

  // IMAGES
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // DATE / TIME
  const [scheduledDate, setScheduledDate] = useState(
    () => new Date()
  );

  const [scheduledTime, setScheduledTime] = useState(() => {
    const now = new Date();

    now.setMinutes(now.getMinutes() + 30);
    now.setSeconds(0);
    now.setMilliseconds(0);

    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // LIFECYCLE
  // =========================

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      searchRequestRef.current += 1;
    };
  }, []);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Create image previews and clean up object URLs
  useEffect(() => {
    const previews = images.map((image) =>
      URL.createObjectURL(image)
    );

    setImagePreviews(previews);

    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // =========================
  // CUSTOMER
  // =========================

  const getCustomerId = () => {
    try {
      const user = localStorage.getItem("user");

      return user ? JSON.parse(user).id_user : null;
    } catch {
      return null;
    }
  };

  const getCustomerName = () => {
    try {
      const user = localStorage.getItem("user");

      return user ? JSON.parse(user).full_name : null;
    } catch {
      return null;
    }
  };

  // =========================
  // LOAD SERVICES
  // =========================

  const fetchServices = useCallback(async () => {
    setServiceLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/service/all/`
      );

      const responseText = await response.text();

      let result;

      try {
        result = responseText ? JSON.parse(responseText) : [];
      } catch {
        throw new Error(
          "API dịch vụ không trả về JSON hợp lệ."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            `Lỗi máy chủ: ${response.status}`
        );
      }

      const list = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.content)
            ? result.content
            : Array.isArray(result?.services)
              ? result.services
              : Array.isArray(result?.result)
                ? result.result
                : [];

      if (mountedRef.current) {
        setServices(list);
      }
    } catch (error) {
      console.error("Fetch services error:", error);

      showToast(
        error.message || "Không thể tải danh sách dịch vụ",
        "error"
      );
    } finally {
      if (mountedRef.current) {
        setServiceLoading(false);
      }
    }
  }, [showToast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // =========================
  // ADDRESS SEARCH
  // =========================

  const searchAddressWithPhoton = async (
    keyword,
    requestId
  ) => {
    const normalizedKeyword = normalizeAddress(keyword);

    if (normalizedKeyword.length < 3) {
      return [];
    }

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const params = new URLSearchParams({
        q: normalizedKeyword,
        limit: "10",
      });

      const response = await fetch(
        `${PHOTON_URL}?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm địa chỉ.");
      }

      const result = await response.json();

      if (
        !mountedRef.current ||
        requestId !== searchRequestRef.current
      ) {
        return [];
      }

      const features = Array.isArray(result?.features)
        ? result.features
        : [];

      const results = features
        .map((feature, index) => {
          const coordinates = feature?.geometry?.coordinates;
          const properties = feature?.properties || {};

          if (
            !Array.isArray(coordinates) ||
            coordinates.length < 2
          ) {
            return null;
          }

          // Photon trả về [longitude, latitude].
          const lon = Number(coordinates[0]);
          const lat = Number(coordinates[1]);

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon) ||
            lat < -90 ||
            lat > 90 ||
            lon < -180 ||
            lon > 180
          ) {
            return null;
          }

          const country = String(
            properties.country || ""
          ).toLowerCase();

          const countryCode = String(
            properties.countrycode || ""
          ).toLowerCase();

          const isVietnam =
            countryCode === "vn" ||
            country.includes("vietnam") ||
            country.includes("việt nam") ||
            country.includes("viet nam");

          if (country && !isVietnam) {
            return null;
          }

          const displayName = formatAddress(properties);

          if (!displayName) {
            return null;
          }

          const distance = currentPosition
            ? calculateDistance(
                currentPosition.latitude,
                currentPosition.longitude,
                lat,
                lon
              )
            : null;

          return {
            id: `${properties.osm_id ?? index}-${lat}-${lon}`,
            latitude: lat,
            longitude: lon,
            display_name: displayName,
            category:
              properties.type || properties.osm_value || "",
            distance,
          };
        })
        .filter(Boolean);

      if (currentPosition) {
        results.sort((a, b) => {
          if (a.distance == null) return 1;
          if (b.distance == null) return -1;

          return a.distance - b.distance;
        });
      }

      return results;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // User manually changes the address
  const handleAddressChange = (value) => {
    searchRequestRef.current += 1;

    setAddress(value);

    // Địa chỉ thay đổi thì phải chọn lại tọa độ.
    setLatitude(null);
    setLongitude(null);

    setAddressResults([]);
    setAddressModalVisible(false);
    setSearchLoading(false);
  };

  // Search address
  const handleSearchAddress = async () => {
    const keyword = normalizeAddress(address);

    if (keyword.length < 3) {
      showToast(
        "Nhập địa chỉ ít nhất 3 ký tự",
        "error"
      );
      return;
    }

    const requestId = ++searchRequestRef.current;

    setLatitude(null);
    setLongitude(null);

    setAddressResults([]);
    setSearchLoading(true);

    try {
      let results = await searchAddressWithPhoton(
        keyword,
        requestId
      );

      if (
        !mountedRef.current ||
        requestId !== searchRequestRef.current
      ) {
        return;
      }

      if (
        results.length === 0 &&
        !/viet\s*nam|việt nam/i.test(keyword)
      ) {
        results = await searchAddressWithPhoton(
          `${keyword}, Vietnam`,
          requestId
        );
      }

      if (
        !mountedRef.current ||
        requestId !== searchRequestRef.current
      ) {
        return;
      }

      setAddressResults(results);
      setAddressModalVisible(true);

      if (results.length === 0) {
        showToast(
          "Không tìm thấy địa chỉ phù hợp",
          "error"
        );
      }
    } catch (error) {
      if (
        !mountedRef.current ||
        requestId !== searchRequestRef.current
      ) {
        return;
      }

      console.error("Search address error:", error);

      showToast(
        error.name === "AbortError"
          ? "Tìm kiếm địa chỉ quá thời gian"
          : error.message || "Không thể tìm kiếm địa chỉ",
        "error"
      );
    } finally {
      if (
        mountedRef.current &&
        requestId === searchRequestRef.current
      ) {
        setSearchLoading(false);
      }
    }
  };

  // Select address from search results
  const handleSelectAddress = (item) => {
    const lat = Number(item.latitude);
    const lon = Number(item.longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      lat < -90 ||
      lat > 90 ||
      lon < -180 ||
      lon > 180
    ) {
      showToast(
        "Tọa độ địa chỉ không hợp lệ",
        "error"
      );
      return;
    }

    // Điền trực tiếp địa chỉ vào ô input.
    setAddress(item.display_name);

    setLatitude(lat);
    setLongitude(lon);

    setAddressModalVisible(false);

    showToast("Đã cập nhật địa chỉ", "success");
  };

  // Press Enter to search address
  const handleAddressKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchAddress();
    }
  };

  // =========================
  // CURRENT LOCATION
  // =========================

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast(
        "Trình duyệt không hỗ trợ lấy vị trí",
        "error"
      );
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          if (
            !Number.isFinite(lat) ||
            !Number.isFinite(lon)
          ) {
            throw new Error("Tọa độ GPS không hợp lệ.");
          }

          if (!mountedRef.current) return;

          setCurrentPosition({
            latitude: lat,
            longitude: lon,
          });

          let resolvedAddress = "";

          try {
            const params = new URLSearchParams({
              lat: String(lat),
              lon: String(lon),
              limit: "1",
            });

            const response = await fetch(
              `${PHOTON_URL}reverse?${params.toString()}`,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const feature = data?.features?.[0];

              if (feature) {
                resolvedAddress = formatAddress(
                  feature.properties || {}
                );
              }
            }
          } catch (error) {
            console.warn(
              "Reverse geocoding error:",
              error
            );
          }

          if (!mountedRef.current) return;

          searchRequestRef.current += 1;

          // Điền địa chỉ GPS trực tiếp vào ô input.
          setAddress(
            resolvedAddress ||
              `${lat.toFixed(6)}, ${lon.toFixed(6)}`
          );

          setLatitude(lat);
          setLongitude(lon);

          setAddressResults([]);
          setAddressModalVisible(false);

          showToast(
            resolvedAddress
              ? "Đã cập nhật địa chỉ hiện tại"
              : "Đã lấy tọa độ GPS",
            "success"
          );
        } catch (error) {
          console.error(error);

          showToast(
            error.message || "Không thể xác định địa chỉ",
            "error"
          );
        } finally {
          if (mountedRef.current) {
            setLocationLoading(false);
          }
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        if (mountedRef.current) {
          setLocationLoading(false);
        }

        switch (error.code) {
          case error.PERMISSION_DENIED:
            showToast(
              "Bạn chưa cấp quyền truy cập vị trí",
              "error"
            );
            break;

          case error.POSITION_UNAVAILABLE:
            showToast(
              "Không xác định được vị trí hiện tại",
              "error"
            );
            break;

          case error.TIMEOUT:
            showToast(
              "Lấy vị trí quá lâu, vui lòng thử lại",
              "error"
            );
            break;

          default:
            showToast(
              "Không thể lấy vị trí hiện tại",
              "error"
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // =========================
  // DATE / TIME
  // =========================

  const handleDateSelect = (date) => {
    if (!date) return;

    const selected = new Date(date);

    selected.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selected < today) {
      showToast(
        "Không được chọn ngày trong quá khứ",
        "error"
      );
      return;
    }

    setScheduledDate(selected);
    setShowCalendar(false);
  };

  const handleTimeChange = (value) => {
    setScheduledTime(value);
  };

  // =========================
  // IMAGES
  // =========================

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    const available = MAX_IMAGES - images.length;

    if (available <= 0) {
      showToast(
        "Chỉ được chọn tối đa 5 ảnh",
        "error"
      );

      event.target.value = "";
      return;
    }

    const validFiles = files.filter((file) =>
      file.type.startsWith("image/")
    );

    const selectedFiles = validFiles.slice(
      0,
      available
    );

    setImages((previous) => [
      ...previous,
      ...selectedFiles,
    ]);

    if (validFiles.length > available) {
      showToast(
        `Bạn chỉ có thể thêm tối đa ${MAX_IMAGES} ảnh`,
        "warning"
      );
    }

    if (validFiles.length === 0) {
      showToast(
        "Vui lòng chọn tệp hình ảnh hợp lệ",
        "error"
      );
    }

    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) =>
      previous.filter(
        (_, imageIndex) => imageIndex !== index
      )
    );
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = () => {
    if (submitting) return;

    const token = getCookie("token");

    const idCustomer = getCustomerId();
    const nameCustomer = getCustomerName();

    if (!token || !idCustomer) {
      navigate("/login", {
        state: {
          from: idTech
            ? `/booking-technician/${idTech}`
            : "/",
        },
      });

      return;
    }

    if (!selectedService) {
      showToast("Vui lòng chọn dịch vụ", "error");
      return;
    }

    const serviceId = getServiceId(selectedService);

    if (
      serviceId === null ||
      serviceId === undefined ||
      serviceId === ""
    ) {
      showToast(
        "Dịch vụ không có ID hợp lệ",
        "error"
      );
      return;
    }

    if (!address.trim()) {
      showToast("Vui lòng nhập địa chỉ", "error");
      return;
    }

    if (
      latitude === null ||
      longitude === null ||
      !Number.isFinite(Number(latitude)) ||
      !Number.isFinite(Number(longitude))
    ) {
      showToast(
        "Vui lòng tìm và chọn địa chỉ hoặc sử dụng GPS",
        "error"
      );
      return;
    }

    if (!description.trim()) {
      showToast(
        "Vui lòng nhập mô tả yêu cầu",
        "error"
      );
      return;
    }

    if (
      description.trim().length >
      MAX_DESCRIPTION_LENGTH
    ) {
      showToast(
        `Mô tả tối đa ${MAX_DESCRIPTION_LENGTH} ký tự`,
        "error"
      );
      return;
    }

    if (!scheduledTime) {
      showToast(
        "Vui lòng chọn giờ thực hiện",
        "error"
      );
      return;
    }

    const [hours, minutes] = scheduledTime
      .split(":")
      .map(Number);

    const selectedDateTime = new Date(
      scheduledDate
    );

    selectedDateTime.setHours(
      hours,
      minutes,
      0,
      0
    );

    if (selectedDateTime.getTime() < Date.now()) {
      showToast(
        "Vui lòng chọn thời gian hiện tại hoặc trong tương lai",
        "error"
      );
      return;
    }

    const formData = {
      id_service: Number(serviceId),
      id_customer: idCustomer,
      name_customer: nameCustomer,
      location: address.trim(),
      latitude: Number(latitude),
      longitude: Number(longitude),
      description: description.trim(),
      scheduled_date: formatDate(scheduledDate),
      scheduled_time: `${scheduledTime}:00`,
    };

    if (idTech) {
      formData.id_technician = idTech;
    }

    console.log("FORM DATA:", formData);

    navigate("/request", {
      state: {
        formData,
        image_request: images,
      },
    });
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-7">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center
              rounded-xl bg-white border border-gray-200
              hover:bg-orange-50 transition"
          >
            <ArrowLeft
              size={23}
              className="text-[#172554]"
            />
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554]">
              Đặt lịch dịch vụ
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Mô tả nhu cầu để chúng tôi hỗ trợ bạn
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-7">

          {/* SERVICE */}
          <section>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Dịch vụ cần sửa chữa
              <span className="text-red-500 ml-1">*</span>
            </label>

            <button
              type="button"
              onClick={() =>
                setServiceModalVisible(true)
              }
              className="w-full min-h-[56px] flex items-center gap-3
                px-4 py-3 border border-gray-300 rounded-xl
                hover:border-orange-400 transition text-left"
            >
              <Wrench
                size={22}
                className="text-[#ff6600] shrink-0"
              />

              <span
                className={`flex-1 ${
                  selectedService
                    ? "text-gray-800 font-medium"
                    : "text-gray-400"
                }`}
              >
                {selectedService
                  ? getServiceName(selectedService)
                  : "Chọn dịch vụ cần sửa chữa"}
              </span>

              <ChevronDown
                size={20}
                className="text-gray-400"
              />
            </button>
          </section>

          {/* ADDRESS */}
          <section>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Địa chỉ thực hiện
              <span className="text-red-500 ml-1">*</span>
            </label>

            {/* ĐỊA CHỈ HIỂN THỊ TRỰC TIẾP TRONG INPUT */}
            <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 py-3 focus-within:border-orange-500 transition">
              <MapPin
                size={22}
                className="text-[#ff6600] shrink-0"
              />

              <input
                type="text"
                value={address}
                onChange={(e) =>
                  handleAddressChange(e.target.value)
                }
                onKeyDown={handleAddressKeyDown}
                placeholder="Nhập địa chỉ, phường/xã, tỉnh/thành..."
                className="w-full outline-none text-sm text-gray-700
                  placeholder:text-gray-400 bg-transparent"
              />

              {address && (
                <button
                  type="button"
                  onClick={() => handleAddressChange("")}
                  className="shrink-0 text-gray-400 hover:text-red-500"
                  title="Xóa địa chỉ"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Nhập địa chỉ rồi chọn kết quả tìm kiếm để xác định vị trí chính xác.
            </p>

            {/* SEARCH ADDRESS */}
            <button
              type="button"
              onClick={handleSearchAddress}
              disabled={searchLoading}
              className="w-full mt-3 min-h-[48px] rounded-xl
                bg-[#ff6600] text-white font-semibold
                flex items-center justify-center gap-2
                hover:bg-[#e65c00] disabled:opacity-60 transition"
            >
              {searchLoading ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <Search size={20} />
              )}

              {searchLoading
                ? "Đang tìm địa chỉ..."
                : "Tìm địa chỉ"}
            </button>

            {/* CURRENT LOCATION */}
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={locationLoading}
              className="w-full mt-3 min-h-[48px] rounded-xl
                border border-orange-200 bg-orange-50
                text-[#e65c00] font-semibold
                flex items-center justify-center gap-2
                hover:bg-orange-100 disabled:opacity-60 transition"
            >
              {locationLoading ? (
                <Loader2
                  size={20}
                  className="animate-spin"
                />
              ) : (
                <Navigation size={20} />
              )}

              {locationLoading
                ? "Đang lấy vị trí..."
                : "Sử dụng vị trí hiện tại"}
            </button>

            {/* COORDINATES STATUS */}
            {latitude !== null &&
              longitude !== null && (
                <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100 flex gap-3">
                  <CheckCircle2
                    size={22}
                    className="text-green-600 shrink-0"
                  />

                  <div>
                    <p className="text-sm font-bold text-green-700">
                      Đã xác định vị trí
                    </p>

                    <p className="text-xs text-gray-600 mt-1">
                      Lat: {Number(latitude).toFixed(6)}
                    </p>

                    <p className="text-xs text-gray-600">
                      Long: {Number(longitude).toFixed(6)}
                    </p>
                  </div>
                </div>
              )}
          </section>

          {/* DATE TIME */}
          <section>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Thời gian thực hiện
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {/* DATE */}
              <div
                className="relative"
                ref={calendarRef}
              >
                <button
                  type="button"
                  onClick={() =>
                    setShowCalendar(!showCalendar)
                  }
                  className="w-full min-h-[76px] flex items-center gap-3
                    p-4 border border-gray-300 rounded-xl
                    hover:border-orange-400 transition text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                    <CalendarDays
                      size={23}
                      className="text-[#ff6600]"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Ngày thực hiện
                    </p>

                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {formatDate(scheduledDate)}
                    </p>
                  </div>
                </button>

                {showCalendar && (
                  <div className="absolute z-50 top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl p-3">
                    <DayPicker
                      mode="single"
                      selected={scheduledDate}
                      onSelect={handleDateSelect}
                      fromDate={new Date()}
                      className="text-sm"
                    />
                  </div>
                )}
              </div>

              {/* TIME */}
              <div className="min-h-[76px] flex items-center gap-3 p-4 border border-gray-300 rounded-xl">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Clock
                    size={23}
                    className="text-[#ff6600]"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">
                    Giờ thực hiện
                  </p>

                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) =>
                      handleTimeChange(e.target.value)
                    }
                    className="w-full outline-none text-sm font-bold text-gray-800 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DESCRIPTION */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-bold text-gray-700">
                Mô tả yêu cầu
                <span className="text-red-500 ml-1">*</span>
              </label>

              <span className="text-xs text-gray-400">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value.slice(
                    0,
                    MAX_DESCRIPTION_LENGTH
                  )
                )
              }
              placeholder="Mô tả tình trạng, vị trí hư hỏng và yêu cầu..."
              rows={5}
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="w-full p-4 border border-gray-300 rounded-xl
                outline-none resize-none text-sm text-gray-700
                placeholder:text-gray-400
                focus:border-orange-500 transition"
            />
          </section>

          {/* IMAGES */}
          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-gray-700">
                Hình ảnh minh họa
              </label>

              <span className="text-xs text-gray-400">
                {images.length}/{MAX_IMAGES}
              </span>
            </div>

            <p className="text-xs text-gray-500 mb-4">
              Thêm ảnh để thợ dễ đánh giá tình trạng cần sửa chữa.
            </p>

            <div className="grid grid-cols-2 gap-3">

              {/* SELECT IMAGES */}
              <label
                className={`flex items-center justify-center gap-2 min-h-[52px]
                  rounded-xl border border-orange-200 bg-orange-50
                  text-[#e65c00] font-semibold text-sm cursor-pointer
                  hover:bg-orange-100 transition
                  ${
                    images.length >= MAX_IMAGES
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
              >
                <ImagePlus size={20} />
                Chọn ảnh

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  disabled={images.length >= MAX_IMAGES}
                  onChange={handleImageUpload}
                />
              </label>

              {/* TAKE PHOTO */}
              <label
                className={`flex items-center justify-center gap-2 min-h-[52px]
                  rounded-xl border border-gray-200 bg-gray-50
                  text-gray-600 font-semibold text-sm cursor-pointer
                  hover:bg-gray-100 transition
                  ${
                    images.length >= MAX_IMAGES
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
              >
                <Camera size={20} />
                Chụp ảnh

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  disabled={images.length >= MAX_IMAGES}
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* IMAGE PREVIEWS */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {images.map((image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                  >
                    <img
                      src={imagePreviews[index]}
                      alt={`Ảnh yêu cầu ${index + 1}`}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8
                        flex items-center justify-center rounded-full
                        bg-black/60 text-white hover:bg-red-500 transition"
                    >
                      <X size={18} />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/40 text-white text-xs truncate">
                      {image.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SUBMIT */}
          <section className="pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full min-h-[54px] flex items-center
                justify-center gap-3 rounded-xl
                bg-[#ff6600] text-white font-bold text-base
                hover:bg-[#e65c00] disabled:opacity-60 transition
                shadow-md shadow-orange-100"
            >
              <Send size={21} />
              Gửi yêu cầu dịch vụ
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Vui lòng kiểm tra thông tin trước khi gửi yêu cầu.
            </p>
          </section>
        </div>
      </div>

      {/* =========================
          MODAL CHỌN DỊCH VỤ
      ========================= */}
      {serviceModalVisible && (
        <div
          className="fixed inset-0 z-[1000] bg-black/40
            flex items-center justify-center p-4"
          onClick={() =>
            setServiceModalVisible(false)
          }
        >
          <div
            className="w-full max-w-lg max-h-[80vh] bg-white
              rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b">
              <div>
                <h3 className="text-lg font-extrabold text-[#172554]">
                  Chọn dịch vụ
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Chọn dịch vụ bạn cần hỗ trợ
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setServiceModalVisible(false)
                }
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={21} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {serviceLoading ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Loader2
                    size={30}
                    className="animate-spin text-[#ff6600]"
                  />

                  <p className="text-sm text-gray-500">
                    Đang tải dịch vụ...
                  </p>
                </div>
              ) : services.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-gray-500">
                    Chưa có dữ liệu dịch vụ.
                  </p>

                  <button
                    type="button"
                    onClick={fetchServices}
                    className="text-sm text-orange-600 font-semibold mt-3"
                  >
                    Tải lại danh sách
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {services.map((item, index) => {
                    const itemId = getServiceId(item);
                    const selectedId =
                      getServiceId(selectedService);

                    const isSelected =
                      itemId != null &&
                      selectedId != null &&
                      String(itemId) ===
                        String(selectedId);

                    return (
                      <button
                        key={String(itemId ?? index)}
                        type="button"
                        onClick={() => {
                          setSelectedService(item);
                          setServiceModalVisible(false);
                        }}
                        className={`w-full flex items-center gap-3 p-4
                          rounded-xl border text-left transition
                          ${
                            isSelected
                              ? "border-orange-400 bg-orange-50"
                              : "border-gray-200 hover:border-orange-300 hover:bg-orange-50/50"
                          }`}
                      >
                        <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">
                          <Wrench
                            size={22}
                            className="text-[#ff6600]"
                          />
                        </div>

                        <span className="flex-1 text-sm font-semibold text-gray-700">
                          {getServiceName(item)}
                        </span>

                        {isSelected && (
                          <CheckCircle2
                            size={22}
                            className="text-[#ff6600]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MODAL CHỌN ĐỊA CHỈ
      ========================= */}
      {addressModalVisible && (
        <div
          className="fixed inset-0 z-[1000] bg-black/40
            flex items-center justify-center p-4"
          onClick={() =>
            setAddressModalVisible(false)
          }
        >
          <div
            className="w-full max-w-lg max-h-[80vh]
              bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="text-lg font-extrabold text-[#172554]">
                  Chọn địa chỉ
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Chọn đúng địa điểm để cập nhật tọa độ.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setAddressModalVisible(false)
                }
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={21} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {addressResults.length === 0 ? (
                <div className="py-12 text-center">
                  <MapPin
                    size={35}
                    className="mx-auto text-gray-300 mb-3"
                  />

                  <p className="text-sm text-gray-500">
                    Không có kết quả phù hợp.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {addressResults.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        handleSelectAddress(item)
                      }
                      className="w-full flex items-start gap-3
                        p-4 rounded-xl border border-gray-200
                        hover:border-orange-400 hover:bg-orange-50
                        transition text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                        <MapPin
                          size={21}
                          className="text-[#ff6600]"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                          {item.display_name}
                        </p>

                        {item.category && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.category}
                          </p>
                        )}

                        {item.distance != null && (
                          <p className="text-xs text-gray-500 mt-1">
                            Cách vị trí hiện tại khoảng{" "}
                            {item.distance < 1
                              ? `${Math.round(
                                  item.distance * 1000
                                )} m`
                              : `${item.distance.toFixed(
                                  1
                                )} km`}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 mt-1">
                          {item.latitude.toFixed(6)},{" "}
                          {item.longitude.toFixed(6)}
                        </p>
                      </div>

                      <ChevronDown
                        size={18}
                        className="-rotate-90 text-gray-400 shrink-0"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
