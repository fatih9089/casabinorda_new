import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Check, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  userType: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    userType: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, userType: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.message || !formData.userType) {
      setError('Please fill in all required fields and select your user type.');
      setIsSubmitting(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    try {
      // EmailJS ile form gönderimi
      const result = await emailjs.send(
        'service_aye53iy',
        'template_ooxnw4q',
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          userType: formData.userType,
          subject: 'New Contact Form Message'
        },
        'PekYKb6ImWD2awBBC'
      );
      
      console.log('EmailJS result:', result);
      
      if (result.status === 200) {
        setIsSubmitted(true);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          userType: ''
        });
      }
    } catch (error) {
      setError('An error occurred while sending your message. Please try again later.');
      console.error('EmailJS error in Contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-primary mb-2">Contact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            You can contact us for your questions or requests. We will get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-primary mb-6">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">Address</h4>
                  <p className="text-gray-600">Kemeraltı Mah.99.sok.No:13-8, 48700 Marmaris Mugla</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600">+90 (534) 500 82 60</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MessageCircle className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">WhatsApp</h4>
                  <p className="text-gray-600">+90 (501) 151 34 91</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600">info@casabinorda.org</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="font-medium mb-2">Working Hours</h4>
              <p className="text-gray-600">Monday - Friday: 09:00 - 18:00</p>
              <p className="text-gray-600">Saturday: 09:00 - 14:00</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-bold text-primary mb-6">Send Us a Message</h3>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <p className="text-green-700">Your message has been sent successfully. We will contact you as soon as possible.</p>
              </div>
            ) : (
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">I am a...</label>
                  <div className="grid grid-cols-1 gap-3 pl-4">
                    <div 
                      onClick={() => handleUserTypeChange('patient')}
                      className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${formData.userType === 'patient' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                    >
                      <span>Patient/Patient Relative</span>
                      {formData.userType === 'patient' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div 
                      onClick={() => handleUserTypeChange('healthcare')}
                      className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${formData.userType === 'healthcare' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                    >
                      <span>Healthcare Professional</span>
                      {formData.userType === 'healthcare' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div 
                      onClick={() => handleUserTypeChange('business')}
                      className={`p-3 border rounded-md cursor-pointer flex items-center justify-between transition-colors ${formData.userType === 'business' ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'}`}
                    >
                      <span>Wholesaler/Merchant</span>
                      {formData.userType === 'business' && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  </div>
                  <input type="hidden" name="userType" value={formData.userType} />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition duration-200 disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
