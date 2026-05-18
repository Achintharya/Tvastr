import { useState } from 'react'
import { SectionShell } from '@/components/primitives/SectionShell'
import { CONFIG, openContact } from '@/lib/config'

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const subject = `Demo Request from ${formData.name || 'Website Visitor'}`
    const body = `Name: ${formData.name}
Email: ${formData.email}

Message:
${formData.message}

---
Sent from Tvastr website contact form`

    openContact(CONFIG.emails.contact, subject, body)
  }

  return (
    <SectionShell id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <p className="text-base text-txt-secondary leading-relaxed mb-8">
              Ready to bring persistent industrial intelligence to your manufacturing environment? 
              Schedule a live demonstration to see how Tvastr transforms data into actionable insight.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-txt-secondary">
                <span className="font-semibold text-txt-primary">Email:</span> achintharya@tvastr.co
              </p>
              <p className="text-sm text-txt-secondary">
                <span className="font-semibold text-txt-primary">Location:</span> Bengaluru, India — with global deployment capability
              </p>
            </div>
          </div>

          {/* Right: form */}
          <form 
            onSubmit={handleSubmit}
            className="p-5 md:p-8 rounded-lg border" 
            style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-default)' }}
          >
            <h3 className="text-xl font-bold text-txt-primary mb-6">Request a Demo</h3>
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-4 py-3 rounded text-txt-primary focus:outline-none focus:ring-1 focus:ring-telemetry-primary"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-4 py-3 rounded text-txt-primary focus:outline-none focus:ring-1 focus:ring-telemetry-primary"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your manufacturing process"
                rows="4"
                className="w-full px-4 py-3 rounded text-txt-primary focus:outline-none focus:ring-1 focus:ring-telemetry-primary"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)' }}
              />
              <button 
                type="submit"
                className="w-full px-8 py-3 bg-telemetry-primary text-bg-primary font-semibold tracking-wider uppercase rounded hover:bg-telemetry-secondary transition-colors"
              >
                Schedule Demo
              </button>
            </div>
          </form>
      </div>
    </SectionShell>
  )
}
