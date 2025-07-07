import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Send email using EmailJS
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: 'service_default',
          template_id: 'template_default', 
          user_id: 'H29aues5IzHpsK6Hs', // Replace with your EmailJS public key
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            to_email: 'kwizerarsn@gmail.com'
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message. I'll get back to you soon!",
        });
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-foreground"
          placeholder="Your Name"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-foreground"
          placeholder="your.email@example.com"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors text-foreground resize-none"
          placeholder="Your message here..."
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 px-6 rounded-lg font-medium hover:from-accent hover:to-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-glow"
      >
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;