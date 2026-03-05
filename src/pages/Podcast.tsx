import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, Pause, Headphones, Clock, Calendar, Download,
  Share2, Heart, SkipBack, SkipForward, Volume2, ExternalLink
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';

const episodes = [
  {
    id: '1',
    number: 12,
    title: 'The Fourth Trimester: What Nobody Tells You',
    description: 'Dr. Megor discusses the often-overlooked fourth trimester and why the first 12 weeks postpartum are crucial for both mother and baby.',
    guest: { name: 'Dr. Sarah Johnson', role: 'OB-GYN Specialist' },
    duration: 45,
    date: '2025-02-15',
    image: 'https://images.unsplash.com/photo-1478737270239-2fccd27ee086?auto=format&fit=crop&q=80&w=400',
    audioUrl: '#',
    isNew: true,
  },
  {
    id: '2',
    number: 11,
    title: 'Traditional Wisdom Meets Modern Medicine',
    description: 'A deep dive into how traditional African postnatal practices can complement modern medical care.',
    guest: { name: 'Matron Amaka Okonkwo', role: 'Traditional Birth Attendant' },
    duration: 52,
    date: '2025-02-08',
    image: 'https://images.unsplash.com/photo-1571235123956-6f81e6490333?auto=format&fit=crop&q=80&w=400',
    audioUrl: '#',
    isNew: false,
  },
  {
    id: '3',
    number: 10,
    title: 'Breastfeeding Struggles: You Are Not Alone',
    description: 'Real stories from mothers who struggled with breastfeeding and how they found their way.',
    guest: { name: 'Nurse Tolani Adewale', role: 'Lactation Consultant' },
    duration: 38,
    date: '2025-02-01',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=400',
    audioUrl: '#',
    isNew: false,
  },
  {
    id: '4',
    number: 9,
    title: 'When Dads Feel Left Out',
    description: 'Dr. Kofi Mensah shares insights on how fathers can navigate feelings of exclusion during the postpartum period.',
    guest: { name: 'Dr. Kofi Mensah', role: 'Pediatric Consultant' },
    duration: 41,
    date: '2025-01-25',
    image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=400',
    audioUrl: '#',
    isNew: false,
  },
  {
    id: '5',
    number: 8,
    title: 'Postpartum Depression: Breaking the Silence',
    description: 'An honest conversation about postpartum mental health, signs to watch for, and how to seek help.',
    guest: { name: 'Dr. Amara Obi', role: 'Clinical Psychologist' },
    duration: 55,
    date: '2025-01-18',
    image: 'https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=400',
    audioUrl: '#',
    isNew: false,
  },
  {
    id: '6',
    number: 7,
    title: 'Sleep Training: Myths vs Reality',
    description: 'What really works when it comes to helping your baby (and you) get better sleep.',
    guest: { name: 'Dr. Megor Ikuenobe', role: 'Host' },
    duration: 36,
    date: '2025-01-11',
    image: 'https://images.unsplash.com/photo-1505576121720-9551e39fbbaf?auto=format&fit=crop&q=80&w=400',
    audioUrl: '#',
    isNew: false,
  },
];

const platforms = [
  { name: 'Spotify', icon: '🎵', url: '#' },
  { name: 'Apple Podcasts', icon: '🎧', url: '#' },
  { name: 'Google Podcasts', icon: '📻', url: '#' },
  { name: 'YouTube', icon: '▶️', url: '#' },
];

export const Podcast: React.FC = () => {
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [likedEpisodes, setLikedEpisodes] = useState<Set<string>>(new Set());

  const togglePlay = (episodeId: string) => {
    setPlayingEpisode(playingEpisode === episodeId ? null : episodeId);
  };

  const toggleLike = (episodeId: string) => {
    setLikedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const latestEpisode = episodes[0];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="mb-4 bg-primary-500/20 text-primary-300">
                <Headphones className="w-3 h-3 mr-1" />
                Podcast
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Beyond Birth Podcast
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Weekly conversations with Dr. Megor and expert guests covering everything 
                from traditional wisdom to modern parenting challenges.
              </p>
              <p className="text-gray-400 mb-8">
                {episodes.length} episodes • New episodes every Thursday
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.url}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <span>{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-white/10 backdrop-blur border-white/10 p-6">
                <Badge className="mb-4" variant="success">Latest Episode</Badge>
                <div className="flex gap-4 mb-4">
                  <img
                    src={latestEpisode.image}
                    alt={latestEpisode.title}
                    className="w-24 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Episode {latestEpisode.number}</p>
                    <h3 className="font-bold text-white mb-2">{latestEpisode.title}</h3>
                    <p className="text-sm text-gray-400">
                      with {latestEpisode.guest.name}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">{latestEpisode.description}</p>
                
                {/* Mini Player */}
                <div className="bg-black/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlay(latestEpisode.id)}
                        className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                      >
                        {playingEpisode === latestEpisode.id ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-1" />
                        )}
                      </button>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {playingEpisode === latestEpisode.id ? 'Now Playing' : 'Play Episode'}
                        </p>
                        <p className="text-xs text-gray-400">{latestEpisode.duration} min</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full">
                    <div className="h-full w-0 bg-primary-500 rounded-full" />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Host Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
              alt="Dr. Megor Ikuenobe"
              className="w-32 h-32 rounded-full object-cover"
            />
            <div className="text-center md:text-left">
              <p className="text-sm text-primary-600 font-semibold mb-1">Your Host</p>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Dr. Megor Ikuenobe</h2>
              <p className="text-gray-600">
                Founder of Omugwo Academy and passionate advocate for maternal health. 
                Each week, Dr. Megor brings you honest conversations about the joys and 
                challenges of parenthood in Africa and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* All Episodes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-black text-gray-900 mb-8">All Episodes</h2>
          
          <div className="space-y-4">
            {episodes.map((episode, idx) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card hover className="p-0 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-48 flex-shrink-0">
                      <img
                        src={episode.image}
                        alt={episode.title}
                        className="w-full h-40 md:h-full object-cover"
                      />
                      <button
                        onClick={() => togglePlay(episode.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                          {playingEpisode === episode.id ? (
                            <Pause className="w-6 h-6 text-primary-600" />
                          ) : (
                            <Play className="w-6 h-6 text-primary-600 ml-1" />
                          )}
                        </div>
                      </button>
                      {episode.isNew && (
                        <Badge className="absolute top-3 left-3" variant="success">New</Badge>
                      )}
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">
                            Episode {episode.number} • {new Date(episode.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{episode.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{episode.description}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar name={episode.guest.name} size="sm" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{episode.guest.name}</p>
                                <p className="text-xs text-gray-500">{episode.guest.role}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {episode.duration} min
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleLike(episode.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                likedEpisodes.has(episode.id) 
                                  ? 'text-red-500 bg-red-50' 
                                  : 'text-gray-400 hover:bg-gray-100'
                              }`}
                            >
                              <Heart className={`w-5 h-5 ${likedEpisodes.has(episode.id) ? 'fill-current' : ''}`} />
                            </button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                              <Share2 className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Episodes
            </Button>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Headphones className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-black mb-4">Never Miss an Episode</h2>
          <p className="text-primary-100 mb-8">
            Subscribe on your favorite platform and get notified when new episodes drop.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
