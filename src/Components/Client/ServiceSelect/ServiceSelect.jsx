import { ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';

function ServiceSelect({ services, selectedService, setSelectedService }) {
    const [open, setOpen] = useState(false);

    const selected = services.find((s) => s.id_service === Number(selectedService));

    return (
        <div className="relative">
            {/* Button */}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-300 bg-white hover:border-orange-500 focus:ring-2 focus:ring-orange-400 transition"
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
                    {selected ? selected.name_service : '-- Chọn dịch vụ --'}
                </span>
                <ChevronDown
                    className={`w-5 h-5 transition ${open ? 'rotate-180 text-orange-500' : 'text-gray-500'}`}
                />
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {services.map((service) => (
                        <div
                            key={service.id_service}
                            onClick={() => {
                                setSelectedService(service.id_service);
                                setOpen(false);
                            }}
                            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-orange-50 transition"
                        >
                            <span className="text-gray-800">{service.name_service}</span>
                            {selectedService === service.id_service && <Check className="w-4 h-4 text-orange-500" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ServiceSelect;
