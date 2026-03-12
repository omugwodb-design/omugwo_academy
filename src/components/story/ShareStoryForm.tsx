import React, { useMemo, useState } from 'react';
import { X, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

type ShareStoryFormProps = {
  triggerLabel?: string;
  triggerClassName?: string;
  source?: string;
  title?: string;
  description?: string;
};

type StoryFormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  storyFormat: string;
  storyTitle: string;
  story: string;
  consent: boolean;
};

const initialState: StoryFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: '',
  storyFormat: 'written_article',
  storyTitle: '',
  story: '',
  consent: false,
};

export const ShareStoryForm: React.FC<ShareStoryFormProps> = ({
  triggerLabel = 'SHARE YOUR STORY',
  triggerClassName,
  source = 'landing_page',
  title = 'Share Your Omugwo Story',
  description = 'Tell us about your journey and we will follow up with the best next step for your preferred format.',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [form, setForm] = useState<StoryFormState>(initialState);

  const canSubmit = useMemo(() => {
    return Boolean(
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.email.trim() &&
      form.storyTitle.trim() &&
      form.story.trim() &&
      form.consent
    );
  }, [form]);

  const updateField = <K extends keyof StoryFormState,>(key: K, value: StoryFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    if (isSubmitted) {
      setIsSubmitted(false);
      setForm(initialState);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error('Please complete the required fields before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        email: form.email.trim().toLowerCase(),
        full_name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
        phone: form.phone.trim() || null,
        source: source,
        status: 'new',
        lead_magnet: `story_submission:${form.storyFormat}`,
        utm_campaign: form.storyTitle.trim(),
        utm_medium: form.location.trim() || null,
        utm_source: form.story.trim(),
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success('Your story has been submitted successfully.');
    } catch (err: any) {
      console.error('Share story submission error:', err);
      toast.error(err?.message || 'Failed to submit your story.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button size="lg" className={triggerClassName} onClick={() => setIsOpen(true)}>
        {triggerLabel}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-2xl" padding="none">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 px-6 py-5 backdrop-blur">
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 max-w-xl">{description}</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8">
              {isSubmitted ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Thank you for sharing your story</h3>
                  <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                    We have received your submission and our team will review it and follow up with you using your preferred contact details.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <Button onClick={closeModal}>Done</Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                      <Input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} placeholder="Adaeze" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
                      <Input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} placeholder="Okonkwo" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
                      <Input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Phone Number</label>
                      <Input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="0800 000 0000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                      <Input value={form.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Lagos, Nigeria" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Preferred Format</label>
                      <select
                        value={form.storyFormat}
                        onChange={(e) => updateField('storyFormat', e.target.value)}
                        className="w-full h-12 px-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        <option value="written_article">Written Article</option>
                        <option value="video_submission">Video Submission</option>
                        <option value="podcast_feature">Podcast Feature</option>
                        <option value="live_video">Live Video</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Story Title</label>
                    <Input value={form.storyTitle} onChange={(e) => updateField('storyTitle', e.target.value)} placeholder="How Omugwo changed my postnatal journey" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your Story</label>
                    <textarea
                      value={form.story}
                      onChange={(e) => updateField('story', e.target.value)}
                      placeholder="Share the good, the hard, and the transformative moments of your Omugwo journey..."
                      className="w-full min-h-[180px] p-4 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors resize-y"
                    />
                  </div>

                  <label className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60 p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => updateField('consent', e.target.checked)}
                      className="mt-1 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 accent-primary-600"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      I consent to Omugwo Academy storing my submission and contacting me about this story campaign and related follow-up.
                    </span>
                  </label>

                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={closeModal} className="bg-transparent">
                      Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} disabled={!canSubmit}>
                      Submit Story
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
