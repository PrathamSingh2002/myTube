import { createNewTweet } from '@/services/tweets';
import { useState, useEffect, useRef } from 'react';
import { LuLoader } from 'react-icons/lu';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface TweetPopupProps {
  isOpen: boolean;
  onClose: () => void;
  submitButtonText: string;
}

const TweetPopup: React.FC<TweetPopupProps> = ({ isOpen, onClose, submitButtonText }) => {
  const [tweet, setTweet] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const createTweet = async () => {
    try {
      await createNewTweet(tweet);
    } catch (err) {
      throw new Error("Failed to create tweet");
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tweet.trim()) {
      setLoading(true);
      setSuccessMessage('');
      setErrorMessage('');
      try {
        await createTweet();
        setSuccessMessage("Tweet posted successfully");
        setTimeout(() => {
          onClose();
        }, 2000);
      } catch (err) {
        setErrorMessage("Network error. Please try again.");
      } finally {
        setTweet('');
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={popupRef} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Tweet</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={4}
            placeholder="What's happening?"
            value={tweet}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setTweet(e.target.value)}
            maxLength={280}
          />
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500 font-medium">{280 - tweet.length} characters remaining</span>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition duration-200 ease-in-out flex items-center"
              disabled={(tweet.trim().length === 0) || loading}
            >
              {loading ? <div  className="animate-spin mr-2" ><LuLoader/></div> : null}
              {submitButtonText}
            </button>
          </div>
          {successMessage && (
            <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <div className="mr-2" >

              <FiCheckCircle />
              </div>
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <div className="mr-2" >
              <FiAlertCircle />
              </div>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
        </form>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition duration-200 ease-in-out"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TweetPopup;