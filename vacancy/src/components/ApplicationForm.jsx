import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ApplicationForm({ form, vacancyId, onSubmit, onClose, isOpen }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (form && form.questions) {
      const initialAnswers = {};
      form.questions.forEach(q => {
        if (q.type === 'checkbox') {
          initialAnswers[q._id] = [];
        } else {
          initialAnswers[q._id] = '';
        }
      });
      setAnswers(initialAnswers);
      setErrors({});
    }
  }, [form]);

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    setAnswers(prev => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter(v => v !== option) };
      }
    });
  };

  const handleFileChange = (questionId, file) => {
    if (file) {
      // For now, we'll store the file name. In production, you'd upload to a server
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange(questionId, reader.result); // Store as base64
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    form.questions.forEach(question => {
      const answer = answers[question._id];
      
      if (question.required) {
        if (question.type === 'checkbox') {
          if (!answer || answer.length === 0) {
            newErrors[question._id] = 'Bu savolga javob berish majburiy';
          }
        } else {
          if (!answer || answer.toString().trim() === '') {
            newErrors[question._id] = 'Bu savolga javob berish majburiy';
          }
        }
      }

      // Validate select/radio options
      if ((question.type === 'select' || question.type === 'radio') && answer) {
        if (!question.options || !question.options.includes(answer)) {
          newErrors[question._id] = 'Noto\'g\'ri tanlov';
        }
      }

      // Validate checkbox options
      if (question.type === 'checkbox' && answer && Array.isArray(answer)) {
        const invalidOptions = answer.filter(opt => !question.options.includes(opt));
        if (invalidOptions.length > 0) {
          newErrors[question._id] = 'Noto\'g\'ri tanlovlar';
        }
      }

      // Validate email
      if (question.type === 'email' && answer) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(answer)) {
          newErrors[question._id] = 'Noto\'g\'ri email manzil';
        }
      }

      // Validate number
      if (question.type === 'number' && answer) {
        if (isNaN(answer) || answer === '') {
          newErrors[question._id] = 'Noto\'g\'ri raqam';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    
    try {
      // Format answers for API
      const formattedAnswers = form.questions.map(question => ({
        questionId: question._id,
        answer: answers[question._id]
      }));

      await onSubmit(vacancyId, formattedAnswers);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !form) return null;

  const sortedQuestions = [...form.questions].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col my-8">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{form.nom}</h2>
                    <p className="text-blue-100 text-sm">Barcha majburiy savollarga javob bering</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-gray-200 transition-colors p-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6">
                <div className="space-y-6">
                  {sortedQuestions.map((question, index) => (
                    <div key={question._id} className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        {question.question}
                        {question.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {/* Text Input */}
                      {question.type === 'text' && (
                        <input
                          type="text"
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          placeholder={question.placeholder || ''}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Textarea */}
                      {question.type === 'textarea' && (
                        <textarea
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          placeholder={question.placeholder || ''}
                          rows={4}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Number Input */}
                      {question.type === 'number' && (
                        <input
                          type="number"
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          placeholder={question.placeholder || ''}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Email Input */}
                      {question.type === 'email' && (
                        <input
                          type="email"
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          placeholder={question.placeholder || ''}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Phone Input */}
                      {question.type === 'phone' && (
                        <input
                          type="tel"
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          placeholder={question.placeholder || ''}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Date Input */}
                      {question.type === 'date' && (
                        <input
                          type="date"
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Select */}
                      {question.type === 'select' && (
                        <select
                          value={answers[question._id] || ''}
                          onChange={(e) => handleChange(question._id, e.target.value)}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Tanlang...</option>
                          {question.options?.map((option, idx) => (
                            <option key={idx} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      )}

                      {/* Radio */}
                      {question.type === 'radio' && (
                        <div className="space-y-2">
                          {question.options?.map((option, idx) => (
                            <label key={idx} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name={question._id}
                                value={option}
                                checked={answers[question._id] === option}
                                onChange={(e) => handleChange(question._id, e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Checkbox */}
                      {question.type === 'checkbox' && (
                        <div className="space-y-2">
                          {question.options?.map((option, idx) => (
                            <label key={idx} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={(answers[question._id] || []).includes(option)}
                                onChange={(e) => handleCheckboxChange(question._id, option, e.target.checked)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* File Input */}
                      {question.type === 'file' && (
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(question._id, e.target.files[0])}
                          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors[question._id] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      )}

                      {/* Error Message */}
                      {errors[question._id] && (
                        <p className="text-sm text-red-600">{errors[question._id]}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Form Actions */}
                <div className="mt-8 flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                      submitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Ariza yuborish</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



