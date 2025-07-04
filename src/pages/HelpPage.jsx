import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  TruckIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqCategories = [
    {
      id: 'orders',
      title: 'Orders & Shipping',
      icon: TruckIcon,
      faqs: [
        {
          id: 1,
          question: 'How can I track my order?',
          answer: 'You can track your order by visiting our Track Order page and entering your order number. You will also receive tracking information via email once your order ships.'
        },
        {
          id: 2,
          question: 'What are your shipping options?',
          answer: 'We offer standard shipping (5-7 business days), express shipping (2-3 business days), and overnight shipping. Free shipping is available on orders over $50.'
        },
        {
          id: 3,
          question: 'Can I change or cancel my order?',
          answer: 'You can modify or cancel your order within 1 hour of placing it. After that, please contact our customer service team for assistance.'
        },
        {
          id: 4,
          question: 'What if my package is damaged or lost?',
          answer: 'If your package arrives damaged or goes missing, please contact us immediately. We will work with the shipping carrier to resolve the issue and ensure you receive your order.'
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payments & Billing',
      icon: CreditCardIcon,
      faqs: [
        {
          id: 5,
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers.'
        },
        {
          id: 6,
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.'
        },
        {
          id: 7,
          question: 'Can I get a refund?',
          answer: 'Yes, we offer full refunds within 30 days of purchase for unused items in original condition. Digital products may have different refund policies.'
        }
      ]
    },
    {
      id: 'products',
      title: 'Products & Returns',
      icon: ShoppingBagIcon,
      faqs: [
        {
          id: 8,
          question: 'How do I return an item?',
          answer: 'To return an item, go to your account orders page, select the item you want to return, and follow the return instructions. You can also contact customer service for assistance.'
        },
        {
          id: 9,
          question: 'What is your return policy?',
          answer: 'We accept returns within 30 days of delivery. Items must be unused, in original packaging, and in resalable condition. Some items like personalized products may not be returnable.'
        },
        {
          id: 10,
          question: 'Do you offer warranties on products?',
          answer: 'Yes, many of our products come with manufacturer warranties. Warranty information is available on individual product pages. We also offer extended warranty options for select items.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Account & Profile',
      icon: UserIcon,
      faqs: [
        {
          id: 11,
          question: 'How do I create an account?',
          answer: 'Click on the "Account" icon in the top right corner and select "Register". Fill in your details to create your account and start shopping with saved preferences.'
        },
        {
          id: 12,
          question: 'I forgot my password. How do I reset it?',
          answer: 'On the login page, click "Forgot Password" and enter your email address. We will send you instructions to reset your password.'
        },
        {
          id: 13,
          question: 'How do I update my account information?',
          answer: 'Log into your account and go to the Profile section. You can update your personal information, addresses, and preferences from there.'
        }
      ]
    }
  ];

  const contactOptions = [
    {
      id: 'phone',
      title: 'Phone Support',
      description: 'Speak with our customer service team',
      contact: '1-800-MARKETNEST',
      hours: 'Mon-Fri: 9AM-8PM EST',
      icon: PhoneIcon
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'Send us your questions anytime',
      contact: 'support@marketnest.com',
      hours: 'Response within 24 hours',
      icon: EnvelopeIcon
    },
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Start Chat',
      hours: 'Mon-Fri: 9AM-6PM EST',
      icon: ChatBubbleLeftRightIcon
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
          <p className="text-gray-600">Find answers to your questions or get in touch with our support team</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            {filteredFaqs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <QuestionMarkCircleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try searching with different keywords or browse our categories below.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredFaqs.map((category) => (
                  <div key={category.id} className="bg-white rounded-lg shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center gap-3">
                        <category.icon className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {category.faqs.map((faq) => (
                        <div key={faq.id}>
                          <button
                            onClick={() => toggleFaq(faq.id)}
                            className="w-full px-6 py-4 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{faq.question}</span>
                              {expandedFaq === faq.id ? (
                                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                              )}
                            </div>
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-6 pb-4">
                              <p className="text-gray-600">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <div className="space-y-4">
              {contactOptions.map((option) => (
                <div key={option.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <option.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{option.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{option.description}</p>
                      <p className="font-medium text-blue-600 mb-1">{option.contact}</p>
                      <p className="text-gray-500 text-sm">{option.hours}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/track-order" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Track Your Order
                </a>
                <a href="/profile" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Manage Your Account
                </a>
                <a href="/orders" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Order History
                </a>
                <a href="/wishlist" className="block text-blue-600 hover:text-blue-700 text-sm">
                  Your Wishlist
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
