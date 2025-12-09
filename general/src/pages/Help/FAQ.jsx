import { motion } from 'framer-motion'

function FAQ() {
  const faqs = [
    { question: 'Savol 1?', answer: 'Javob 1' },
    { question: 'Savol 2?', answer: 'Javob 2' },
    { question: 'Savol 3?', answer: 'Javob 3' },
  ]

  return (
    <div className="p-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          FAQ
        </h1>
        <p className="text-gray-600">
          Tez-tez beriladigan savollar
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {faq.question}
            </h3>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FAQ

