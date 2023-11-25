import { Box, Flex, useMediaQuery } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { duration } from "moment";
import { ReactNode, useEffect, useState } from "react";

export const Pops = ({
  children,
  duration,
  delay,
}: {
  delay?: number;
  duration?: number;
  children: JSX.Element;
}) => {
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
  children: JSX.Element[];
  duration?: number;
  delay?: number;
}) => {
  if (!children) return;

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
}: {
  children: JSX.Element;
  duration?: number;
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

interface slideProps {
  children: JSX.Element;
  from: "right" | "left" | "top" | "bottom";
  duration?: number;
  delay?: number;
}

export const Slide = ({ children, from, duration, delay }: slideProps) => {
  const initX = from == "right" ? 1080 : from == "left" ? -1080 : 0;
  const initY = from == "top" ? -640 : from == "bottom" ? 640 : 0;

  return (
    <motion.div
      initial={{ position: "relative", top: initY, left: initX }}
      whileInView={{
        top: 0,
        left: 0,
        transition: {
          duration: duration ?? 0.5,
          delay: delay ?? 0,
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
  children: JSX.Element[];
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
  if (type == "height") {
    return (
      <Flex height={height ?? "auto"} width={width ?? "auto"} flexDir="column" justifyContent="flex-end">
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
    <Flex height={height ?? "auto"} width={width ?? "auto"} flexDir="column" justifyContent="flex-end">
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