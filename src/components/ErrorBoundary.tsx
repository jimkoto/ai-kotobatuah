import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'Terjadi gangguan pada aplikasi.',
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F4] text-[#0D1117] flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white border border-stone-200 rounded-xl p-8">
            <p className="text-xs font-medium tracking-wide text-[#1D4ED8] mb-2">
              kotobatuah.com
            </p>
            <h1 className="text-2xl font-bold tracking-tight mb-3">
              Terjadi kendala saat memuat halaman
            </h1>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Sistem kami mendeteksi gangguan tak terduga. Silakan muat ulang halaman untuk melanjutkan.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#0D1117] text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
