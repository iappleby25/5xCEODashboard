import { useState, useEffect } from 'react';

interface UseLuzmoEmbedOptions {
  width?: string;
  height?: string;
  autoLoad?: boolean;
}

/**
 * Hook for embedding Luzmo dashboards
 * 
 * @param containerId ID of the HTML element where the dashboard will be embedded
 * @param dashboardId ID of the Luzmo dashboard to embed
 * @param token Auth token for Luzmo
 * @param signature Security signature for Luzmo embed
 * @param timestamp Timestamp for the signature
 * @param options Additional options for the embed
 * @returns Object with loading state and error
 */
const useLuzmoEmbed = (
  containerId: string,
  dashboardId: string,
  token: string,
  signature: string,
  timestamp: number,
  options: UseLuzmoEmbedOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const embedLuzmoDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real implementation, we would use the Luzmo client SDK
        // Since we don't have that available, we're mocking the embed functionality
        
        // Load the Luzmo SDK script if it doesn't exist yet
        const loadLuzmoSDK = () => {
          return new Promise<void>((resolve, reject) => {
            // Check if SDK is already loaded
            if (window.cumul && window.cumul.dashboard) {
              resolve();
              return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = 'https://cdn.luzmo.com/js/embed/v2.0/cumul.js';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Luzmo SDK'));
            document.head.appendChild(script);
          });
        };

        // Wait for SDK to load
        await loadLuzmoSDK();

        // Get the container element
        const container = document.getElementById(containerId);
        if (!container) {
          throw new Error(`Container element with ID "${containerId}" not found`);
        }

        // Set container dimensions
        if (options.width) container.style.width = options.width;
        if (options.height) container.style.height = options.height;

        // Mock the dashboard loading with a timeout
        // In a real implementation, we would use the Luzmo SDK:
        // 
        // window.cumul.dashboard(containerId, {
        //   dashboardId,
        //   token,
        //   signature,
        //   timestamp,
        //   ...additionalOptions
        // });
        
        // For now, let's create a mock dashboard to show
        setTimeout(() => {
          if (container) {
            // Create a mock dashboard UI
            container.innerHTML = `
              <div style="width: 100%; height: 100%; padding: 20px; overflow: auto;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto 1fr; gap: 16px; height: 100%;">
                  <!-- Top row charts -->
                  <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="font-size: 14px; color: #666; margin-bottom: 12px;">Response Distribution</h4>
                    <div style="display: flex; justify-content: center; align-items: center; height: calc(100% - 30px);">
                      <div style="width: 120px; height: 120px; border-radius: 60px; border: 16px solid #3F51B5; position: relative; display: flex; align-items: center; justify-content: center;">
                        <div style="position: absolute; inset: 0; border-radius: 60px; border: 16px solid transparent; border-left-color: #2196F3; border-right-color: #2196F3; transform: rotate(-45deg);"></div>
                        <span style="font-size: 24px; font-weight: 600;">76%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="font-size: 14px; color: #666; margin-bottom: 12px;">Department Engagement</h4>
                    <div style="display: flex; align-items: end; justify-content: space-around; height: calc(100% - 30px); padding: 0 12px;">
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; background: #3F51B5; height: 56px; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
                        <span style="font-size: 12px; margin-top: 4px;">Eng</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; background: #3F51B5; height: 80px; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
                        <span style="font-size: 12px; margin-top: 4px;">HR</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; background: #3F51B5; height: 40px; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
                        <span style="font-size: 12px; margin-top: 4px;">Sales</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; background: #3F51B5; height: 64px; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
                        <span style="font-size: 12px; margin-top: 4px;">Mkt</span>
                      </div>
                      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="width: 100%; background: #3F51B5; height: 96px; border-top-left-radius: 4px; border-top-right-radius: 4px;"></div>
                        <span style="font-size: 12px; margin-top: 4px;">Prod</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Bottom row chart (spans 2 columns) -->
                  <div style="background: white; border-radius: 8px; padding: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); grid-column: span 2;">
                    <h4 style="font-size: 14px; color: #666; margin-bottom: 12px;">Trend Over Time</h4>
                    <div style="height: calc(100% - 30px); width: 100%; position: relative;">
                      <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: #eee;"></div>
                      <div style="position: absolute; top: 0; left: 0; right: 0; height: 1px; background: #eee;"></div>
                      <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #eee;"></div>
                      
                      <svg style="width: 100%; height: 100%;" viewBox="0 0 300 100" preserveAspectRatio="none">
                        <path d="M0,50 C20,40 40,80 60,70 C80,60 100,30 120,40 C140,50 160,20 180,10 C200,0 220,30 240,20 C260,10 280,30 300,20" 
                              fill="none" 
                              stroke="#3F51B5" 
                              stroke-width="2"></path>
                        <path d="M0,70 C20,60 40,90 60,80 C80,70 100,50 120,60 C140,70 160,40 180,50 C200,60 220,50 240,40 C260,30 280,50 300,40" 
                              fill="none" 
                              stroke="#2196F3" 
                              stroke-width="2"></path>
                      </svg>
                      
                      <div style="position: absolute; bottom: 0; width: 100%; display: flex; justify-content: space-between; font-size: 12px; color: #666;">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
          setIsLoading(false);
        }, 1000);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    // Only try to embed if we have a dashboard ID
    if (dashboardId && containerId) {
      embedLuzmoDashboard();
    } else {
      setError('Missing required parameters');
      setIsLoading(false);
    }

    // Clean up function
    return () => {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [containerId, dashboardId, token, signature, timestamp, options]);

  return { isLoading, error };
};

// Add this to make TypeScript happy with the window.cumul property
declare global {
  interface Window {
    cumul: {
      dashboard: (containerId: string, options: any) => void;
    };
  }
}

export default useLuzmoEmbed;
