import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="flex items-center justify-center p-6 min-h-[70vh] text-center">
      <div className="flex flex-col items-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="font-display font-black text-6xl text-slate-900 dark:text-slate-100 mb-2">
          404
        </h1>
        <h2 className="font-display font-bold text-xl text-slate-800 dark:text-slate-200 mb-2">
          Off the beaten track!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          The page or tourist destination you are seeking cannot be found.
        </p>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate('/home')}>
          Return Home
        </Button>
      </div>
    </PageWrapper>
  );
}

export default NotFound;
