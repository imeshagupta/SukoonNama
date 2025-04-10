import React, { useState } from "react";
import styles from "../styles/Faqs.module.css";

const faqsData = [
  {
    question: "What is SukoonNama?",
    answer:
      "SukoonNama is a digital platform where poetry, thoughts, and heartfelt words are woven into expressions of emotion.",
  },
  {
    question: "Can I share my poetry here?",
    answer:
      "Absolutely! We warmly welcome new writers. You can submit your creations through our 'Submit' page. We will showcase your work on our platform.",
  },
  {
    question: "Is SukoonNama only in Hindi, Hinglish or English?",
    answer:
      "Primarily, SukoonNama focuses on Hindi, but we respect emotional expressions written in any language.",
  },
  {
    question: "Is the content on SukoonNama free to read?",
    answer:
      "Yes, all poetry and writings on SukoonNama are available for free. Our aim is to share emotions, not earn profits.",
  },
];

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.faq}>
        <h2 className={styles.heading}>Frequently Asked Questions</h2>
        <div className={styles.accordion}>
          {faqsData.map((faq, index) => (
            <div key={index} className={styles.accordionItem}>
              <div
                className={styles.accordionHeader}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className={styles.icon}>
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </div>
              {openIndex === index && (
                <div className={styles.accordionBody}>{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faqs;
