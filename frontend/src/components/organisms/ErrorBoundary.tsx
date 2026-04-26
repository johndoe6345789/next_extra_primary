'use client';

import React, { Component, type ReactNode } from 'react';
import { generateDebugCode } from '@/utils/debugCode';
import ErrorFallback from '../molecules/ErrorFallback';

/** Props for the ErrorBoundary. */
interface ErrorBoundaryProps {
  /** Child components to render. */
  children: ReactNode;
}

/** State for the ErrorBoundary. */
interface ErrorBoundaryState {
  /** Whether an error has been caught. */
  hasError: boolean;
  /** Generated debug reference code. */
  debugCode: string;
  /** Original error message. */
  message: string;
}

/**
 * Catches React render errors and displays a
 * debug code the user can share with support.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps, ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    debugCode: '',
    message: '',
  };

  static getDerivedStateFromError(
    error: unknown,
  ): Partial<ErrorBoundaryState> {
    const message =
      error instanceof Error ? error.message : String(error);
    return {
      hasError: true,
      debugCode: generateDebugCode(message),
      message,
    };
  }

  componentDidCatch(error: unknown): void {
    // eslint-disable-next-line no-console
    console.error(
      `[ErrorBoundary] ${this.state.debugCode}:`,
      error,
    );
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      debugCode: '',
      message: '',
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          debugCode={this.state.debugCode}
          message={this.state.message}
          onReset={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
