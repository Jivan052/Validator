import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useAuth } from '../contexts/AuthContext';
import { QUESTION_LIMIT } from '../config/constants';

const RequestMoreQuestionsForm = ({ onClose }) => {
  const { currentUser } = useAuth();
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Configure EmailJS with your service, template, and public key
    // These should be stored in environment variables in production
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Create template parameters
    const templateParams = {
      user_name: formRef.current.user_name.value,
      user_email: formRef.current.user_email.value,
      message: formRef.current.message.value,
      user_id: currentUser.uid,
      user_email_address: currentUser.email
    };

    try {
      // Send email using EmailJS
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error sending email:', error);
      setError('Failed to send request. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-indigo-600 p-6">
        <h2 className="text-xl font-bold text-white">Request More Questions</h2>
        <p className="text-indigo-100 mt-1">
          You've reached your limit of {QUESTION_LIMIT} follow-up questions.
        </p>
      </div>

      {success ? (
        <div className="p-6">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">
                  Your request has been sent successfully! We'll review it and get back to you soon.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                defaultValue={currentUser?.displayName || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                Your Email
              </label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                defaultValue={currentUser?.email || ''}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Why do you need more questions?
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Please explain briefly why you need more questions for your idea analysis."
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default RequestMoreQuestionsForm;