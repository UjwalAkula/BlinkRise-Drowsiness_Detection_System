import React, { useRef, useEffect } from 'react';

const VideoPart = ({
    videoStreamUrl,
    backendError,
    isVideoOn,
    videoLoading,
    setVideoLoading,
    drowsinessData,
    streamKey,
    handleToggleVideo
}) => {
    const imgRef = useRef(null);
    const loadingTimeoutRef = useRef(null);
    const audioRef = useRef(null);

    // 🎥 Handle video image loading
    useEffect(() => {
        const currentImg = imgRef.current;

        if (loadingTimeoutRef.current) {
            clearTimeout(loadingTimeoutRef.current);
            loadingTimeoutRef.current = null;
        }

        if (isVideoOn) {
            setVideoLoading(true);

            if (currentImg) {
                const handleLoad = () => {
                    setVideoLoading(false);
                    clearTimeout(loadingTimeoutRef.current);
                };
                const handleError = () => {
                    setVideoLoading(false);
                    clearTimeout(loadingTimeoutRef.current);
                };

                currentImg.addEventListener('load', handleLoad);
                currentImg.addEventListener('error', handleError);

                loadingTimeoutRef.current = setTimeout(() => {
                    setVideoLoading(false); // fallback
                }, 2500);

                return () => {
                    currentImg.removeEventListener('load', handleLoad);
                    currentImg.removeEventListener('error', handleError);
                    clearTimeout(loadingTimeoutRef.current);
                };
            }
        } else {
            setVideoLoading(false);
        }
    }, [isVideoOn, streamKey, setVideoLoading]);

    // 🔊 Handle alarm audio
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (drowsinessData.alarm_on) {
            audio.play().catch(e => console.error("Alarm play error:", e));
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [drowsinessData.alarm_on]);

    const imageUrl = isVideoOn ? `${videoStreamUrl}?key=${streamKey}` : null;

    return (
        <div className="mb-2 text-center">
            <div className="p-3 rounded-lg bg-white shadow-sm relative">
                <h2 className="text-lg font-bold text-gray-800 mb-2.5">Live Camera Feed</h2>

                <div className={`relative w-full aspect-video flex items-center justify-center bg-gray-200 overflow-hidden rounded-md border ${backendError ? 'border-red-500' : 'border-gray-300'}`}>
                    {videoLoading && !backendError && (
                        <div className="absolute w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {isVideoOn ? (
                        <img
                            key={streamKey}
                            ref={imgRef}
                            src={imageUrl || ''}
                            alt="Live Video Feed"
                            className="w-full h-auto max-h-full object-contain"
                        />
                    ) : (
                        <p className="text-lg font-semibold text-gray-500">Video Off</p>
                    )}

                    {backendError && (
                        <p className="absolute bottom-2 left-2 right-2 text-sm text-red-600 bg-white/80 px-2 py-1 rounded">
                            Error: {backendError}
                        </p>
                    )}
                </div>

                <audio ref={audioRef} loop src="/alaram.mp3" preload="auto"></audio>

                <div className="px-4 mt-4 rounded-md flex flex-col md:flex-row items-center justify-between gap-2 bg-gray-50">
                    <p className={`font-bold text-center md:text-left ${drowsinessData.alarm_on ? 'text-red-600' : 'text-green-600'}`}>
                        Status: {drowsinessData.status} {drowsinessData.alarm_on && '(ALARM)'}
                    </p>
                    <button
                        onClick={handleToggleVideo}
                        className={`text-white text-sm md:text-base px-5 py-2 rounded-full shadow-md cursor-pointer transition-transform duration-200 hover:scale-105 ${isVideoOn ? 'bg-red-600' : 'bg-blue-500'}`}
                    >
                        {isVideoOn ? "Turn Off" : "Turn On"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPart;
