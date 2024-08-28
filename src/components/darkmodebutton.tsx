import { motion } from 'framer-motion';
import classes from '../styles/darkmode.module.css';
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <div
    className={`${classes.switch}  ${isDarkMode ? classes.dark  : classes.light}`}
    data-isOn={isDarkMode}
      onClick={onToggle}
    >
      <motion.div layout transition={spring}>
        {isDarkMode ? <MoonIcon className={classes.icon} /> : <SunIcon className={classes.icon} />}
      </motion.div>
    </div>
  );
}

const spring = {
  type: 'spring',
  stiffness: 200,
  damping: 30,
};
