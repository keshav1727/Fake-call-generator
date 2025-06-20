import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, User, MessageCircle, UserPlus, Mic, MicOff, Volume2, Video, MoreHorizontal } from 'lucide-react';

interface CallState {
  isActive: boolean;
  callerName: string;
  startTime: Date | null;
  duration: string;
}

const App: React.FC = () => {
  const [callerName, setCallerName] = useState('');
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    callerName: '',
    startTime: null,
    duration: '00:00'
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (callState.isActive && callState.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - callState.startTime!.getTime()) / 1000);
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        setCallState(prev => ({
          ...prev,
          duration: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState.isActive, callState.startTime]);

  const startCall = () => {
    if (!callerName.trim()) return;
    
    setCallState({
      isActive: true,
      callerName: callerName.trim(),
      startTime: new Date(),
      duration: '00:00'
    });
  };

  const endCall = () => {
    setCallState({
      isActive: false,
      callerName: '',
      startTime: null,
      duration: '00:00'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  };

  if (callState.isActive) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%)'
      }}>
        {/* Status Bar - Exact iPhone style */}
        <div className="flex justify-between items-center px-6 py-2 text-white text-sm font-medium">
          <div className="font-semibold">
            {formatTime(currentTime)}
          </div>
          <div className="flex items-center space-x-1">
            {/* Signal bars */}
            <div className="flex items-end space-x-0.5">
              <div className="w-1 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-2 bg-white rounded-full"></div>
              <div className="w-1 h-3 bg-white rounded-full"></div>
              <div className="w-1 h-2 bg-white/50 rounded-full"></div>
            </div>
            {/* WiFi icon */}
            <svg className="w-4 h-3 ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
            </svg>
            {/* Battery */}
            <div className="flex items-center ml-1">
              <div className="w-6 h-3 border border-white rounded-sm relative">
                <div className="w-full h-full bg-white rounded-sm"></div>
              </div>
              <div className="w-0.5 h-1.5 bg-white rounded-r-sm ml-0.5"></div>
            </div>
          </div>
        </div>

        {/* Info Button */}
        <div className="absolute top-14 right-6 z-10">
          <button className="w-7 h-7 border border-white/40 rounded-full flex items-center justify-center">
            <span className="text-white/70 text-xs font-normal">i</span>
          </button>
        </div>

        {/* Call Duration */}
        <div className="text-center pt-12 pb-2">
          <div className="text-white/90 text-base font-light tracking-wider">{callState.duration}</div>
        </div>

        {/* Caller Name */}
        <div className="text-center pb-12">
          <div className="text-white text-5xl font-thin tracking-tight px-8 leading-tight">{callState.callerName}</div>
        </div>

        {/* Spacer to push controls to bottom */}
        <div className="flex-1"></div>

        {/* Call Controls - Exact iPhone layout */}
        <div className="pb-20 px-12">
          {/* Top Row of Controls */}
          <div className="flex justify-between items-center mb-16">
            <div className="flex flex-col items-center">
              <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Volume2 className="w-7 h-7 text-white" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-xs mt-2 font-light">Audio</span>
            </div>
            
            <div className="flex flex-col items-center">
              <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Video className="w-7 h-7 text-white" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-xs mt-2 font-light">FaceTime</span>
            </div>
            
            <div className="flex flex-col items-center">
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm ${
                  isMuted ? 'bg-white' : 'bg-white/20'
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-7 h-7 text-black" strokeWidth={1.5} />
                ) : (
                  <Mic className="w-7 h-7 text-white" strokeWidth={1.5} />
                )}
              </button>
              <span className="text-white/80 text-xs mt-2 font-light">Mute</span>
            </div>
          </div>

          {/* Bottom Row of Controls */}
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <UserPlus className="w-7 h-7 text-white" strokeWidth={1.5} />
              </button>
              <span className="text-white/80 text-xs mt-2 font-light">Add</span>
            </div>
            
           <div className="flex flex-col items-center">
  <button
    onClick={endCall}
    className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center active:scale-95 transition-transform"
  >
    <Phone
      className="w-6 h-6 text-white"
      strokeWidth={2.5}
      style={{ transform: 'rotate(138deg)' }}
    />
  </button>
  <span className="text-white/90 text-sm mt-2">End</span>
</div>  
            <div className="flex flex-col items-center">
              <button className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-1">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                  ))}
                </div>
              </button>
              <span className="text-white/80 text-xs mt-2 font-light">Keypad</span>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-white/60 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col font-sf">
      {/* Header */}
      <div className="text-center pt-16 pb-8 animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl glass-effect mb-6 animate-bounce-gentle">
          <Phone className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Fake iPhone Calls</h1>
        <p className="text-lg text-white/80 max-w-md mx-auto px-6">
          Your escape route from awkward situations. Quick, realistic, and always available.
        </p>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white/10 glass-effect rounded-3xl p-8 ios-shadow animate-slide-up">
            {/* Input */}
            <div className="mb-8">
              <label className="block text-white/90 text-sm font-medium mb-3">
                Who's calling?
              </label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                placeholder="Enter caller name"
                className="w-full px-4 py-4 bg-white/20 glass-effect rounded-2xl text-white placeholder-white/60 border border-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                maxLength={30}
              />
            </div>

            {/* Call Button */}
            <button
              onClick={startCall}
              disabled={!callerName.trim()}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                callerName.trim()
                  ? 'bg-ios-green call-button-shadow text-white hover:scale-105 active:scale-95'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center space-x-3">
                <Phone className="w-6 h-6" />
                <span>Call Me Now</span>
              </div>
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-white/70 text-sm">
              💡 <strong>Pro tip:</strong> Say "Sorry, I have to take this" and walk away confidently
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
        <div className="text-white/60 text-sm">
          Free • No app required • Works instantly
        </div>
      </div>
    </div>
  );
};

export default App;