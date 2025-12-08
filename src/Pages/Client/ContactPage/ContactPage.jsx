import ContactHeader from '../../../Components/Client/ContactHeader/ContactHeader';
import ContactInfo from '../../../Components/Client/ContactInfo/ContactInfo';
import ContactForm from '../../../Components/Client/ContactForm/ContactForm';
import ContactMap from '../../../Components/Client/ContactMap/ContactMap';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-5">
            <div className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-lg border">
                {/* Header */}
                <ContactHeader />

                {/* Grid */}
                <div className="grid md:grid-cols-2 gap-10">
                    <div>
                        <ContactInfo />
                        <ContactMap />
                    </div>

                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
