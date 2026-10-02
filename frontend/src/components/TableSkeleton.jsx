// FreshFlow Table Skeleton Component (Stripe / Vercel loading standard)
// Renders quiet, structural skeleton rows matching table column dimensions
import React from 'react';

function TableSkeleton({ rows = 6 }) {
  return (
    <div className="table-skeleton-wrap">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-col" style={{ width: '80px' }}>
            <span className="skeleton-pill" style={{ width: '60px' }}></span>
          </div>
          <div className="skeleton-col" style={{ flex: 1.6 }}>
            <span className="skeleton-line" style={{ width: '65%' }}></span>
            <span className="skeleton-subline" style={{ width: '40%' }}></span>
          </div>
          <div className="skeleton-col" style={{ flex: 1.8 }}>
            <span className="skeleton-line" style={{ width: '80%' }}></span>
          </div>
          <div className="skeleton-col" style={{ width: '100px' }}>
            <span className="skeleton-pill" style={{ width: '70px' }}></span>
          </div>
          <div className="skeleton-col text-right" style={{ width: '90px' }}>
            <span className="skeleton-line ml-auto" style={{ width: '50px' }}></span>
          </div>
          <div className="skeleton-col text-right" style={{ width: '100px' }}>
            <span className="skeleton-line ml-auto" style={{ width: '60px' }}></span>
          </div>
          <div className="skeleton-col" style={{ width: '150px' }}>
            <span className="skeleton-line" style={{ width: '95px' }}></span>
          </div>
          <div className="skeleton-col" style={{ width: '110px' }}>
            <span className="skeleton-pill" style={{ width: '85px' }}></span>
          </div>
          <div className="skeleton-col text-right" style={{ width: '110px' }}>
            <span className="skeleton-btn ml-auto" style={{ width: '80px' }}></span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
