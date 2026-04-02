import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion } from "framer-motion";

const ForceGraph = ({ interactions, characters }) => {
  const graphRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Prepare graph data
  const graphData = useMemo(() => {
    if (!interactions.length || !Object.keys(characters).length) {
      return { nodes: [], links: [] };
    }

    // Get unique character names from interactions
    const characterNames = new Set();
    interactions.forEach((edge) => {
      characterNames.add(edge.source);
      characterNames.add(edge.target);
    });

    // Create nodes with message counts
    const nodes = Array.from(characterNames)
      .filter((name) => characters[name])
      .map((name) => ({
        id: name,
        name,
        messageCount: characters[name]?.message_count || 0,
        sceneCount: characters[name]?.scene_count || 0,
      }))
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, 40); // Top 40 characters

    const nodeIds = new Set(nodes.map((n) => n.id));

    // Filter links to only include nodes in our set
    const links = interactions
      .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
      .map((edge) => ({
        source: edge.source,
        target: edge.target,
        value: edge.weight,
      }));

    return { nodes, links };
  }, [interactions, characters]);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: Math.max(height, 400) });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Node rendering
  const nodeCanvasObject = useCallback(
    (node, ctx, globalScale) => {
      const label = node.name;
      const fontSize = Math.max(10 / globalScale, 3);
      const nodeSize = Math.sqrt(node.messageCount) / 3 + 3;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = hoveredNode === node.id ? "#2563EB" : "#1A1A1A";
      ctx.fill();

      // Label
      if (globalScale > 0.5 || hoveredNode === node.id) {
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = hoveredNode === node.id ? "#2563EB" : "#52525B";
        ctx.fillText(label, node.x, node.y + nodeSize + 2);
      }
    },
    [hoveredNode]
  );

  // Link rendering
  const linkCanvasObject = useCallback((link, ctx) => {
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.strokeStyle = "#E4E4E7";
    ctx.lineWidth = Math.min(link.value / 10, 2);
    ctx.stroke();
  }, []);

  if (!graphData.nodes.length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-[#A1A1AA]">
        加载中...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[500px] force-graph-container">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        nodePointerAreaPaint={(node, color, ctx) => {
          const nodeSize = Math.sqrt(node.messageCount) / 3 + 3;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize + 5, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeHover={(node) => setHoveredNode(node?.id || null)}
        onNodeClick={(node) => {
          if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 500);
            graphRef.current.zoom(2, 500);
          }
        }}
        cooldownTicks={100}
        linkDirectionalParticles={0}
        enableNodeDrag={true}
        backgroundColor="transparent"
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
      />
      
      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-[#E4E4E7]"
        >
          <div className="font-medium text-[#1A1A1A]">{hoveredNode}</div>
          <div className="text-sm text-[#52525B] mt-1">
            {characters[hoveredNode]?.message_count} 条消息 · {characters[hoveredNode]?.scene_count} 个场景
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ForceGraph;
