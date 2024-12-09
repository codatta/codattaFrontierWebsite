import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

export default function Demo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(".target", {
        x: 500,
        scrollTrigger: {
          trigger: ".target",
          start: "top top",
          end: "bottom ",
          scrub: true,
          // toggleActions: "play reverse play reverse",
          onUpdate: (self) => {
            // 获取滚动进度 0-1
            console.log("progress:", self.progress);
            // 获取滚动方向 1(向下) 或 -1(向上)
            //   console.log("direction:", self.direction);
            //   // 获取速度
            //   console.log("velocity:", self.getVelocity());
          },
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="h-[300vh]" ref={containerRef}>
      <div className="flex justify-around gap-4 px-4">
        <div
          className="box bg-[green] flex-1 h-[100px] flex items-center justify-center"
          data-speed="0.25"
        >
          0.25
        </div>
        <div
          className="box bg-[purple] flex-1 h-[100px] flex items-center justify-center"
          data-speed="0.4"
        >
          0.4
        </div>
        <div
          className="box bg-[orange] flex-1 h-[100px] flex items-center justify-center"
          data-speed="0"
        >
          0
        </div>
        <div
          className="box bg-[red] flex-1 h-[100px] flex items-center justify-center"
          data-speed="1"
        >
          1
        </div>
        <div
          className="box bg-[blue] flex-1 h-[100px] flex items-center justify-center"
          data-speed="0.75"
        >
          0.75
        </div>
      </div>
      <div className="bg-[red] h-[30vh] w-[200px] m-auto target mt-[100vh]"></div>
      <div className="line bg-[blue] w-full h-[1px] mt-10"></div>
    </div>
  );
}
