import { motion } from "framer-motion";

// Scroll-triggered fade/slide-up reveal used across sections.
export const Reveal = ({ children, delay = 0, y = 24, className = "", ...rest }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0, 1] }}
    {...rest}
  >
    {children}
  </motion.div>
);

export default Reveal;
