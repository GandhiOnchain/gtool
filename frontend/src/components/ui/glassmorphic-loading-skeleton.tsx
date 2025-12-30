import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Code,
  Palette,
  Package,
  Settings,
  Globe,
  Shield,
  BookOpen,
  GitBranch,
} from 'lucide-react';

interface GlassmorphicLoadingSkeletonProps {
  filenames?: string[];
  projectName?: string;
  showProjectName?: boolean;
}

// File types and their corresponding icons (all using consistent foreground color)
const fileTypeConfig = {
  'package.json': { icon: Package, color: 'text-foreground/80' },
  'vite.config.js': { icon: Settings, color: 'text-foreground/80' },
  'index.html': { icon: Globe, color: 'text-foreground/80' },
  '.jsx': { icon: Code, color: 'text-foreground/80' },
  '.tsx': { icon: Code, color: 'text-foreground/80' },
  '.js': { icon: Code, color: 'text-foreground/80' },
  '.ts': { icon: Code, color: 'text-foreground/80' },
  '.css': { icon: Palette, color: 'text-foreground/80' },
  '.sol': { icon: Shield, color: 'text-foreground/80' },
  '.env': { icon: Settings, color: 'text-foreground/80' },
  '.md': { icon: BookOpen, color: 'text-foreground/80' },
  '.gitignore': { icon: GitBranch, color: 'text-foreground/80' },
  'default': { icon: FileText, color: 'text-foreground/80' },
};

// Sample project files in realistic development order
const sampleFiles = [
  'package.json',
  'vite.config.js',
  'index.html',
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
  'Wallet.jsx',
  'src/hooks/useWeb3.js',
  'contracts/Token.sol',
  '.env.local',
  'README.md',
  '.gitignore',
  'src/components/Header.tsx',
  'src/utils/helpers.js',
  'public/favicon.ico',
  'tailwind.config.js',
  'src/components/Footer.tsx',
  'src/styles/globals.css',
  'src/lib/constants.js',
  'contracts/migrations.js',
];

const GlassmorphicLoadingSkeleton = ({
  filenames,
  projectName,
  showProjectName = true,
}: GlassmorphicLoadingSkeletonProps) => {
  // Use provided filenames if available, otherwise fall back to sample files
  const displayFiles = filenames && filenames.length > 0 ? filenames : sampleFiles;
  const [populatedFiles, setPopulatedFiles] = useState<number[]>([]);
  const [shimmerFiles, setShimmerFiles] = useState<number[]>([]);
  const [currentlyActive, setCurrentlyActive] = useState<number[]>([]);
  const [currentlyProcessing, setCurrentlyProcessing] = useState<number[]>([]);
  const [currentlyFinishing, setCurrentlyFinishing] = useState<number[]>([]);
  const [spinnerFrame, setSpinnerFrame] = useState(0);

  // Spinner characters for processing animation
  const spinnerFrames = ['|', '/', '—', '\\'];

  // Animation orchestration
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Phase 1: File Population - staggered appearance of file names
    displayFiles.slice(0, 12).forEach((_, index) => {
      const randomDelay = 1000 + Math.random() * 2000; // 1-3 seconds per file
      timers.push(setTimeout(() => {
        setPopulatedFiles(prev => [...prev, index]);
      }, 500 + index * randomDelay));
    });

    // Phase 2: File Activity Animations - dots and spinners
    const activationStartTime = 8000; // Start after initial population

    const scheduleRandomActivations = () => {
      let currentTime = activationStartTime;

      // Schedule 100 random file activations over time
      for (let i = 0; i < 100; i++) {
        const randomFileIndex = Math.floor(Math.random() * 12);
        const randomInterval = 2000 + Math.random() * 2000; // 2-4s between activations
        const readingDuration = 2000 + Math.random() * 2000; // 2-4s reading phase
        const processingDuration = 2000 + Math.random() * 2000; // 2-4s processing phase

        // Start reading (dot appears)
        timers.push(setTimeout(() => {
          setCurrentlyActive((prev) => {
            if (!prev.includes(randomFileIndex) && prev.length < 3) {
              return [...prev, randomFileIndex];
            }
            return prev;
          });
        }, currentTime));

        // Start processing (spinner appears, dot stays)
        timers.push(setTimeout(() => {
          setCurrentlyProcessing((prev) => {
            if (!prev.includes(randomFileIndex) && prev.length < 3) {
              return [...prev, randomFileIndex];
            }
            return prev;
          });
        }, currentTime + readingDuration));

        // Finish processing (spinner disappears, dot persists briefly)
        timers.push(setTimeout(() => {
          setCurrentlyProcessing(prev => prev.filter(idx => idx !== randomFileIndex));
          setCurrentlyFinishing((prev) => {
            if (!prev.includes(randomFileIndex)) {
              return [...prev, randomFileIndex];
            }
            return prev;
          });
        }, currentTime + readingDuration + processingDuration));

        // Clear all states
        timers.push(setTimeout(() => {
          setCurrentlyActive(prev => prev.filter(idx => idx !== randomFileIndex));
          setCurrentlyFinishing(prev => prev.filter(idx => idx !== randomFileIndex));
        }, currentTime + readingDuration + processingDuration + 300));

        currentTime += randomInterval;
      }
    };

    scheduleRandomActivations();

    // Phase 3: Shimmer Management - cycling glassmorphic effects
    const scheduleShimmerCycles = () => {
      const maxShimmerFiles = 8; // 2/3 of 12 files

      const activateShimmer = (fileIndex: number) => {
        const duration = 6000 + Math.random() * 14000; // 6-20s shimmer duration

        // Add shimmer
        timers.push(setTimeout(() => {
          setShimmerFiles((prev) => {
            if (!prev.includes(fileIndex) && prev.length < maxShimmerFiles) {
              return [...prev, fileIndex];
            }
            return prev;
          });
        }, 1000));

        // Remove shimmer and schedule next cycle
        timers.push(setTimeout(() => {
          setShimmerFiles(prev => prev.filter(idx => idx !== fileIndex));
          const nextDelay = 2000 + Math.random() * 8000; // 2-10s before next cycle
          timers.push(setTimeout(() => activateShimmer(fileIndex), nextDelay));
        }, 1000 + duration));
      };

      // Initialize shimmer cycles with staggered starts
      for (let i = 0; i < 12; i++) {
        const initialDelay = Math.random() * 5000;
        timers.push(setTimeout(() => activateShimmer(i), initialDelay));
      }
    };

    scheduleShimmerCycles();

    return () => timers.forEach(timer => clearTimeout(timer));
  }, [displayFiles]);

  // Spinner animation timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSpinnerFrame(prev => (prev + 1) % spinnerFrames.length);
    }, 200);

    return () => clearInterval(interval);
  }, [spinnerFrames.length]);

  // Get file type configuration
  const getFileConfig = (filename: string) => {
    // Check for exact filename match
    if (fileTypeConfig[filename as keyof typeof fileTypeConfig]) {
      return fileTypeConfig[filename as keyof typeof fileTypeConfig];
    }

    // Check by file extension
    const extension = filename.includes('.') ? '.' + filename.split('.').pop() : '';
    return fileTypeConfig[extension as keyof typeof fileTypeConfig] || fileTypeConfig.default;
  };

  // Truncate filename intelligently
  const truncateFilename = (filename: string, maxLength: number = 15) => {
    if (filename.length <= maxLength) return filename;

    // Try to preserve file extension
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex > 0) {
      const name = filename.substring(0, lastDotIndex);
      const ext = filename.substring(lastDotIndex);
      const availableSpace = maxLength - ext.length - 3; // 3 for '...'

      if (availableSpace > 3) {
        return name.substring(0, availableSpace) + '...' + ext;
      }
    }

    // Fallback to simple truncation
    return filename.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="w-full h-full bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header Section - Always rendered to maintain layout */}
      <div className="text-center mb-4 flex-shrink-0">
        {showProjectName && (
          <div className="relative inline-block min-h-[2rem] flex items-center justify-center">
            <p className="text-lg font-medium text-foreground font-mono">
              {projectName || (
                <span className="text-foreground/40">Project In Progress...</span>
              )}
            </p>

            {/* Project name shimmer */}
            {projectName && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.075) 50%, transparent 100%)',
                  backgroundSize: '200% 200%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Main File Grid */}
      <div className="relative w-full max-w-3xl">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full place-content-center">
          {displayFiles.slice(0, 12).map((filename, index) => {
            const fileConfig = getFileConfig(filename);
            const isPopulated = populatedFiles.includes(index);
            const hasShimmer = shimmerFiles.includes(index);

            // Activity states - ensure animations complete even if shimmer changes
            const isReading = currentlyActive.includes(index)
              && (hasShimmer || currentlyProcessing.includes(index) || currentlyFinishing.includes(index));
            const isProcessing = currentlyProcessing.includes(index)
              && (hasShimmer || currentlyActive.includes(index) || currentlyFinishing.includes(index));
            const isFinishing = currentlyFinishing.includes(index)
              && (hasShimmer || currentlyActive.includes(index) || currentlyProcessing.includes(index));

            return (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
              >
                <motion.div
                  className={`
                    relative aspect-[4/3] w-full rounded-lg border transition-all duration-500 cursor-pointer group
                    ${isPopulated && hasShimmer
                ? 'backdrop-blur-sm bg-card/50 border-border shadow-sm hover:bg-card/60'
                : isPopulated
                  ? 'bg-card border-border hover:bg-card/90'
                  : 'bg-muted/10 border-muted/50 hover:bg-muted/20'
              }
                  `}
                >
                  {/* Reading Dot */}
                  {(isReading || isFinishing) && isPopulated && (
                    <motion.div
                      className="absolute top-3 right-[17px] w-1.5 h-1.5 bg-accent rounded-full shadow-lg"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                  )}

                  {/* Processing Spinner */}
                  {isProcessing && isPopulated && (
                    <div className="absolute bottom-4 right-3 w-4 h-4 flex items-center justify-center bg-foreground/80 rounded-sm">
                      <span
                        className="text-background font-mono leading-none font-bold"
                        style={{ fontSize: '10px' }}
                      >
                        {spinnerFrames[spinnerFrame]}
                      </span>
                    </div>
                  )}

                  {/* Glassmorphic Shimmer */}
                  {isPopulated && hasShimmer && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.075) 50%, transparent 100%)',
                        backgroundSize: '200% 200%',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}

                  {/* Hover Shimmer */}
                  {isPopulated && (
                    <motion.div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                      }}
                      animate={{
                        backgroundPosition: ['200% 0%', '-200% 0%'],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        repeatDelay: 1,
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="p-2 sm:p-3 h-full flex flex-col relative z-10">
                    {isPopulated
                      ? (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            className="flex flex-col h-full"
                          >
                            {/* File Icon */}
                            <div className="mb-1 sm:mb-2">
                              <fileConfig.icon
                                size={18}
                                className={fileConfig.color}
                              />
                            </div>

                            {/* File Name */}
                            <div className="flex-1 flex flex-col justify-end">
                              <p
                                className="font-mono text-foreground/80 leading-tight break-all"
                                style={{ fontSize: '11px' }}
                                title={filename}
                              >
                                {truncateFilename(filename, 18)}
                              </p>
                            </div>
                          </motion.div>
                        )
                      : (
                        /* Empty State */
                          <div className="flex flex-col h-full">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-muted rounded mb-1 sm:mb-2" />
                            <div className="flex-1 flex flex-col justify-end space-y-1 sm:space-y-2">
                              <div className="h-1.5 sm:h-2 bg-muted rounded w-3/4" />
                              <div className="h-1.5 sm:h-2 bg-muted/60 rounded w-1/2" />
                            </div>
                          </div>
                        )}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GlassmorphicLoadingSkeleton;
