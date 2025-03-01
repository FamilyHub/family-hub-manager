'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  VideoCameraIcon,
  PhoneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface CallHistory {
  id: number;
  name: string;
  avatar: string;
  timestamp: Date;
  duration: string;
  type: 'incoming' | 'outgoing' | 'missed';
}

const callHistory: CallHistory[] = [
  {
    id: 1,
    name: "Mom",
    avatar: "👩",
    timestamp: new Date(),
    duration: "15:23",
    type: "incoming"
  },
  {
    id: 2,
    name: "Dad",
    avatar: "👨",
    timestamp: new Date(Date.now() - 3600000),
    duration: "5:45",
    type: "outgoing"
  },
  {
    id: 3,
    name: "Sister",
    avatar: "👧",
    timestamp: new Date(Date.now() - 7200000),
    duration: "",
    type: "missed"
  },
];

export default function VideoCallPage() {
  const [isInCall, setIsInCall] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallHistory | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);

  const startCall = (call: CallHistory) => {
    setSelectedCall(call);
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setSelectedCall(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] via-[#2d1f47] to-[#1a1c2e]">
      <div className="max-w-7xl mx-auto p-6">
        {isInCall ? (
          <div className="relative h-[80vh] bg-black/50 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10">
            {/* Video Call Interface */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-9xl">{selectedCall?.avatar}</span>
            </div>
            
            {/* Caller Info */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
              <h2 className="text-2xl font-semibold text-white">{selectedCall?.name}</h2>
              <p className="text-white/70">00:00</p>
            </div>

            {/* Small Video Preview */}
            <div className="absolute bottom-24 right-6 w-48 h-36 bg-black/30 rounded-xl border border-white/20 flex items-center justify-center">
              <span className="text-4xl">👤</span>
            </div>

            {/* Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full ${
                  isMuted ? 'bg-red-500' : 'bg-white/10'
                } hover:bg-white/20 transition-colors`}
              >
                <MicrophoneIcon className="h-6 w-6 text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`p-4 rounded-full ${
                  isCameraOff ? 'bg-red-500' : 'bg-white/10'
                } hover:bg-white/20 transition-colors`}
              >
                <VideoCameraIcon className="h-6 w-6 text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSpeakerOff(!isSpeakerOff)}
                className={`p-4 rounded-full ${
                  isSpeakerOff ? 'bg-red-500' : 'bg-white/10'
                } hover:bg-white/20 transition-colors`}
              >
                <SpeakerWaveIcon className="h-6 w-6 text-white" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10">
            <div className="p-6 border-b border-white/10">
              <h1 className="text-2xl font-bold text-white">Video Calls</h1>
            </div>

            {/* Call History */}
            <div className="divide-y divide-white/5">
              {callHistory.map((call) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{call.avatar}</span>
                    <div>
                      <h3 className="text-white font-medium">{call.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${
                          call.type === 'missed' ? 'text-red-400' : 'text-white/70'
                        }`}>
                          {call.type === 'incoming' ? '↙️' : call.type === 'outgoing' ? '↗️' : '❌'}
                        </span>
                        <span className="text-sm text-white/50">
                          {call.timestamp.toLocaleString()}
                        </span>
                        {call.duration && (
                          <span className="text-sm text-white/50">
                            • {call.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => startCall(call)}
                      className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
                    >
                      <VideoCameraIcon className="h-5 w-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                    >
                      <PhoneIcon className="h-5 w-5 text-white" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 