import React from 'react';

const LoadingSkeleton = ({ className = '', variant = 'rectangular', animation = true }) => {
  const baseClasses = 'bg-gray-200';
  const animationClasses = animation ? 'animate-pulse' : '';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    button: 'rounded-lg h-10'
  };

  return (
    <div 
      className={`${baseClasses} ${animationClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Loading..."
    />
  );
};

// Pre-built skeleton components for common use cases
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
    <LoadingSkeleton className="w-full h-48" />
    <div className="space-y-2">
      <LoadingSkeleton variant="text" className="w-3/4" />
      <LoadingSkeleton variant="text" className="w-1/2" />
      <LoadingSkeleton variant="text" className="w-1/4" />
    </div>
    <LoadingSkeleton variant="button" className="w-full" />
  </div>
);

export const OrderCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="w-32" />
        <LoadingSkeleton variant="text" className="w-24" />
      </div>
      <LoadingSkeleton className="w-20 h-6 rounded-full" />
    </div>
    <div className="space-y-2">
      <LoadingSkeleton variant="text" className="w-full" />
      <LoadingSkeleton variant="text" className="w-2/3" />
    </div>
    <div className="flex justify-between items-center pt-4 border-t">
      <LoadingSkeleton variant="text" className="w-24" />
      <LoadingSkeleton variant="button" className="w-24 h-8" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
    <div className="flex items-center space-x-4">
      <LoadingSkeleton variant="circular" className="w-16 h-16" />
      <div className="space-y-2">
        <LoadingSkeleton variant="text" className="w-32" />
        <LoadingSkeleton variant="text" className="w-48" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <LoadingSkeleton variant="text" className="w-20 h-3" />
          <LoadingSkeleton className="w-full h-10 rounded-lg" />
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
