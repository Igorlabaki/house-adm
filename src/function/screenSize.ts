export function useHandleScreenSize() {
  let isSmallScreen = false;

  const checkScreenSize = () => {
    isSmallScreen = window.innerWidth <= 768;
  };

  return {
    checkScreenSize,
    isSmallScreen,
  };
}
