'use client'

import { useState } from 'react'
import { Loader2, Copy, Download, Sparkles } from 'lucide-react'
import CodeEditor from './CodeEditor'

const LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'csharp', label: 'C#' },
]

const EXAMPLE_CODE: Record<string, string> = {
  python: `import logging

logger = logging.getLogger(__name__)

def process_order(order_id, user_id):
    logger.info(f"Processing order {order_id}")
    try:
        # Process order
        logger.info(f"Order {order_id} processed successfully")
    except Exception as e:
        logger.error(f"Failed to process order: {str(e)}")`,

  javascript: `const logger = require('winston');

function processOrder(orderId, userId) {
    logger.info('Processing order ' + orderId);
    try {
        // Process order
        logger.info('Order ' + orderId + ' processed successfully');
    } catch (error) {
        logger.error('Failed to process order: ' + error.message);
    }
}`,

  typescript: `import { Logger } from 'winston';

const logger: Logger = createLogger();

function processOrder(orderId: string, userId: string): void {
    logger.info('Processing order ' + orderId);
    try {
        // Process order
        logger.info('Order ' + orderId + ' processed successfully');
    } catch (error) {
        logger.error('Failed to process order: ' + error.message);
    }
}`,

  java: `import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OrderProcessor {
    private static final Logger logger = LoggerFactory.getLogger(OrderProcessor.class);
    
    public void processOrder(String orderId, String userId) {
        logger.info("Processing order " + orderId);
        try {
            // Process order
            logger.info("Order " + orderId + " processed successfully");
        } catch (Exception e) {
            logger.error("Failed to process order: " + e.getMessage());
        }
    }
}`,

  go: `package main

import "log"

func processOrder(orderID, userID string) {
    log.Printf("Processing order %s", orderID)
    // Process order
    log.Printf("Order %s processed successfully", orderID)
}`,

  ruby: `require 'logger'

logger = Logger.new(STDOUT)

def process_order(order_id, user_id)
  logger.info("Processing order #{order_id}")
  begin
    # Process order
    logger.info("Order #{order_id} processed successfully")
  rescue => e
    logger.error("Failed to process order: #{e.message}")
  end
end`,

  php: `<?php
$logger = new Logger('app');

function processOrder($orderId, $userId) {
    global $logger;
    $logger->info("Processing order " . $orderId);
    try {
        // Process order
        $logger->info("Order " . $orderId . " processed successfully");
    } catch (Exception $e) {
        $logger->error("Failed to process order: " . $e->getMessage());
    }
}`,

  csharp: `using System;
using Microsoft.Extensions.Logging;

public class OrderProcessor {
    private readonly ILogger<OrderProcessor> _logger;
    
    public void ProcessOrder(string orderId, string userId) {
        _logger.LogInformation("Processing order {OrderId}", orderId);
        try {
            // Process order
            _logger.LogInformation("Order {OrderId} processed successfully", orderId);
        } catch (Exception ex) {
            _logger.LogError(ex, "Failed to process order");
        }
    }
}`
}

interface TransformResult {
  code: string
  library: string
  install: string
  imports: string[]
  tips: string[]
}

export default function TransformPanel() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState<TransformResult | null>(null)
  const [language, setLanguage] = useState('python')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTransform = async () => {
    if (!input.trim()) {
      setError('Please enter some code to transform')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, language }),
      })

      if (!response.ok) {
        throw new Error('Failed to transform code')
      }

      const result = await response.json()
      setOutput(result)
    } catch (err) {
      setError('Failed to transform code. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (output?.code) {
      navigator.clipboard.writeText(output.code)
    }
  }

  const handleDownload = () => {
    if (output?.code) {
      const extensions: Record<string, string> = {
        python: 'py',
        javascript: 'js',
        typescript: 'ts',
        java: 'java',
        go: 'go',
        ruby: 'rb',
        php: 'php',
        csharp: 'cs'
      }
      const ext = extensions[language] || 'txt'
      const blob = new Blob([output.code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'transformed.' + ext
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const loadExample = () => {
    setInput(EXAMPLE_CODE[language] || EXAMPLE_CODE.python)
    setOutput(null)
    setError('')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-background text-foreground"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={loadExample}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Load Example
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Input Code</h3>
          <CodeEditor
            value={input}
            onChange={setInput}
            language={language}
            placeholder="Paste your logging code here..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Transformed Output</h3>
            {output && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Download file"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          {output ? (
            <div className="space-y-4">
              <CodeEditor
                value={output.code}
                onChange={() => {}}
                language={language}
                readOnly
              />
              {output.library && (
                <div className="p-4 rounded-lg bg-muted space-y-2">
                  <div>
                    <span className="font-semibold">Library:</span> {output.library}
                  </div>
                  {output.install && (
                    <div>
                      <span className="font-semibold">Install:</span>
                      <code className="ml-2 px-2 py-1 rounded bg-background text-sm">
                        {output.install}
                      </code>
                    </div>
                  )}
                  {output.tips.length > 0 && (
                    <div>
                      <span className="font-semibold">Tips:</span>
                      <ul className="mt-2 space-y-1 text-sm">
                        {output.tips.map((tip, i) => (
                          <li key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
              <p className="text-muted-foreground">
                Transformed code will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleTransform}
          disabled={loading || !input.trim()}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Transforming...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Transform Code
            </>
          )}
        </button>
      </div>
    </div>
  )
}
