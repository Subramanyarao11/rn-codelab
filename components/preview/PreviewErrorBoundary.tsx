'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

interface PreviewErrorBoundaryProps {
  children: ReactNode
  onError?: (message: string) => void
}

interface PreviewErrorBoundaryState {
  error: string | null
}

export class PreviewErrorBoundary extends Component<
  PreviewErrorBoundaryProps,
  PreviewErrorBoundaryState
> {
  state: PreviewErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): PreviewErrorBoundaryState {
    return { error: error.message }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError?.(error.message)
  }

  componentDidUpdate(prevProps: PreviewErrorBoundaryProps) {
    if (prevProps.children !== this.props.children && this.state.error) {
      this.setState({ error: null })
    }
  }

  render() {
    if (this.state.error) {
      const hint = /destroy is not a function/i.test(this.state.error)
        ? 'Tip: useEffect cannot be async. Use useEffect(() => { async function load() { ... }; load(); }, []).'
        : null

      return (
        <div className="flex h-full flex-col justify-center p-4">
          <p className="text-sm font-medium text-red-400">Preview error</p>
          <pre className="mt-2 whitespace-pre-wrap font-mono text-xs text-red-300/90">
            {this.state.error}
          </pre>
          {hint && <p className="mt-3 text-xs text-zinc-500">{hint}</p>}
        </div>
      )
    }

    return this.props.children
  }
}
