import { useEffect, useState } from "react";

function ThemeController() {
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      setIsDark(true);
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      setIsDark(false);
    }
  }, []);


  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="w-[60px] h-[60px] bg-white/10 flex justify-center items-center rounded-md  shadow-lg hover:scale-110  cursor-pointer transition-all duration-500 "
    >
      <input type="checkbox" className="toggle theme-controller text-red-500" checked={isDark} onChange={toggleTheme} />
    </div>
  )
}
export default ThemeController;
