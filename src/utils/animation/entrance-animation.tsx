import { Box, Flex, useDimensions, useMediaQuery } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { duration } from "moment";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "../hooks/useWindowDimensions";
import { useIsMobile } from "../hooks/useIsMobile";

export const Pops = ({
  children,
  duration,
  delay,
}: {
  delay?: number;
  duration?: number;
  children: ReactNode;
}) => {
  const isMobile = useMediaQuery("(max-width: 600px)")[0];

  if (isMobile) {
    return <FadeIn duration={0.8}>{children}</FadeIn>;
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      whileInView={{
        scale: [0, 1.1, 1],
        transition: {
          duration: duration ?? 0.5,
          delay: delay ?? 0,
          times: [0, 0.8, 1],
        },
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredPops = ({
  children,
  duration,
  delay,
}: {
  children: ReactNode[];
  duration?: number;
  delay?: number;
}) => {
  const isMobile = useMediaQuery("(max-width: 600px)")[0];
  if (!children) return;
  if (isMobile) {
    return (
      <StagggeredFadeIn delay={delay} duration={duration}>
        {children}
      </StagggeredFadeIn>
    );
  }

  return (
    <>
      {children.map((e, i) => (
        <Pops duration={duration ?? 0.5} delay={(delay ?? 0.3) * i} key={i}>
          {e}
        </Pops>
      ))}
    </>
  );
};

export const FadeIn = ({
  children,
  duration,
  delay,
}: {
  children: ReactNode;
  duration?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: {
          duration: duration ?? 0.5,
        },
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export const StagggeredFadeIn = ({
  children,
  duration,
  delay,
}: {
  children: ReactNode[];
  duration?: number;
  delay?: number;
}) => {
  return (
    <>
      {children.map((e, i) => (
        <FadeIn duration={duration ?? 0.5} delay={(delay ?? 0.3) * i} key={i}>
          {e}
        </FadeIn>
      ))}
    </>
  );
};

interface slideProps {
  children: ReactNode;
  from: "right" | "left" | "top" | "bottom";
  duration?: number;
  delay?: number;
}

export const Slide = ({ children, from, duration, delay }: slideProps) => {
  const { width: vw, height: vh } = useWindowDimensions();
  const isMobile = useIsMobile();
  const width = 0.8 * vw;
  const height = 0.8 * vh;
  if (isMobile) {
    return <FadeIn>{children}</FadeIn>;
  }

  const initX =
    from == "right" ? width : from == "left" ? (isMobile ? width : -width) : 0;
  const initY = from == "top" ? -height : from == "bottom" ? height : 0;

  return (
    <motion.div
      initial={{
        position: "relative",
        top: 0,
        left: 0,
        overflow: "hidden",
        opacity: 0,
      }}
      whileInView={{
        top: [initY, 0],
        left: [initX, 0],
        opacity: 1,
        transition: {
          duration: duration ?? 0.5,
          delay: delay ?? 0,
          times: [0, 1],
        },
      }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredSlide = ({
  children,
  from,
  duration,
  delay,
}: {
  children: ReactNode[];
  from: slideProps["from"];
  duration: number;
  delay?: number;
}) => {
  if (!children) return;

  return (
    <>
      {children.map((e, i) => (
        <Slide
          from={from}
          duration={duration ?? 0.5}
          delay={(delay ?? 0.3) * i}
          key={i}
        >
          {e}
        </Slide>
      ))}
    </>
  );
};

interface VisGrowProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  type: "height" | "width";
  direction?: "normal" | "reverse";
  height?: number;
  width?: number;
}

export const VisGrow = ({
  children,
  duration,
  delay,
  type,
  direction,
  height,
  width,
}: VisGrowProps) => {
  const isMobile = useMediaQuery("(max-width: 600px)")[0];

  if (!children) {
    return children;
  }

  if (isMobile) {
    return <FadeIn duration={0.8}>{children}</FadeIn>;
  }

  if (type == "height") {
    return (
      <Flex
        height={height ?? "auto"}
        width={width ?? "auto"}
        flexDir="column"
        justifyContent="flex-end"
      >
        <motion.div
          initial={{ height: 0, overflow: "hidden" }}
          whileInView={{
            height: height ?? 100,
            transition: {
              duration: duration ?? 0.5,
              delay: delay ?? 0,
            },
          }}
          viewport={{ once: true }}
        >
          {children}
        </motion.div>
      </Flex>
    );
  }

  return (
    <Flex
      height={height ?? "auto"}
      width={width ?? "auto"}
      flexDir="column"
      justifyContent="flex-end"
    >
      <motion.div
        initial={{ width: 0, overflow: "hidden" }}
        whileInView={{
          width: width ?? 100,
          transition: {
            duration: duration ?? 0.5,
            delay: delay ?? 0,
          },
        }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </Flex>
  );
};
