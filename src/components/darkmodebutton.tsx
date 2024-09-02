import { motion } from 'framer-motion';
import classes from '../styles/darkmode.module.css';
import { MoonIcon, SunIcon } from '@heroicons/react/20/solid';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export default function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <div className={classes.switch} data-isOn={isDarkMode} onClick={onToggle}>
      <motion.div className={classes.icon} layout>
        {isDarkMode ? <MoonIcon className={classes.moon} /> : <SunIcon className={classes.sun} />}
      </motion.div>
      <motion.div className={classes.handle} layout transition={spring} />
    </div>
  );
}

const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 15,
};
