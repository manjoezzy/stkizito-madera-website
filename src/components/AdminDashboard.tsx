import React from 'react';

const renderBannerCard = (event, isPast) => {
  return (
    <div
      key={event.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
    <div
      className={`relative rounded-xl overflow-hidden shadow-sm group ${isPast ? 'opacity-60' : ''}`}
      style={{
        backgroundImage: event.bannerUrl ? `url(${event.bannerUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '180px',
      }}
    </div>
  );
};
