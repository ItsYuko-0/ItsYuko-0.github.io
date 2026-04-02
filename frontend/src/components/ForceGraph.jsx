import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const ForceGraph = ({ interactions, characters }) => {
  const graphRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 700 });
  const [hoveredNode, setHoveredNode] = useState(null);

  // Prepare graph data - show fewer nodes for less clutter
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

    // Create nodes with message counts - only top 20 for clarity
    const nodes = Array.from(characterNames)
      .filter((name) => characters[name])
      .map((name) => ({
        id: name,
        name,
        messageCount: characters[name]?.message_count || 0,
        sceneCount: characters[name]?.scene_count || 0,
      }))
      .sort((a, b) => b.messageCount - a.messageCount)
      .slice(0, 20);

    const nodeIds = new Set(nodes.map((n) => n.id));

    // Filter links - only strong connections (weight > 8)
    const links = interactions
      .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target) && edge.weight > 8)
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
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height: 700 });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Initial zoom and center + configure forces
  useEffect(() => {
    const fg = graphRef.current;
    if (fg && graphData.nodes.length > 0) {
      // Configure stronger repulsion force to spread nodes apart
      fg.d3Force('charge').strength(-1200).distanceMax(500);
      fg.d3Force('link').distance(200).strength(0.2);
      
      // Reheat simulation to apply new forces
      fg.d3ReheatSimulation();
    }
  }, [graphData.nodes.length]);

  // Node rendering with better spacing
  const nodeCanvasObject = useCallback(
    (node, ctx, globalScale) => {
      // Safety check for node coordinates
      if (node.x === undefined || node.y === undefined || !isFinite(node.x) || !isFinite(node.y)) {
        return;
      }

      const label = node.name;
      const fontSize = Math.max(12 / globalScale, 4);
      // Larger nodes for better visibility
      const nodeSize = Math.sqrt(node.messageCount) / 2 + 6;

      // Node circle - solid color instead of gradient to avoid errors
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = hoveredNode === node.id ? "#2563EB" : "#374151";
      ctx.fill();
      
      // White border
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label - always show at reasonable zoom
      if (globalScale > 0.3 || hoveredNode === node.id) {
        ctx.font = `bold ${fontSize}px "Noto Sans SC", Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        
        // Text shadow for readability
        ctx.fillStyle = "#fff";
        ctx.fillText(label, node.x + 1, node.y + nodeSize + 5);
        ctx.fillText(label, node.x - 1, node.y + nodeSize + 5);
        ctx.fillText(label, node.x, node.y + nodeSize + 6);
        ctx.fillText(label, node.x, node.y + nodeSize + 4);
        
        ctx.fillStyle = hoveredNode === node.id ? "#2563EB" : "#1A1A1A";
        ctx.fillText(label, node.x, node.y + nodeSize + 5);
      }
    },
    [hoveredNode]
  );

  // Link rendering
  const linkCanvasObject = useCallback((link, ctx) => {
    // Safety check
    if (!link.source?.x || !link.target?.x || !isFinite(link.source.x) || !isFinite(link.target.x)) {
      return;
    }
    const opacity = Math.min(link.value / 30, 0.8);
    ctx.beginPath();
    ctx.moveTo(link.source.x, link.source.y);
    ctx.lineTo(link.target.x, link.target.y);
    ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
    ctx.lineWidth = Math.min(link.value / 8, 4);
    ctx.stroke();
  }, []);

  const handleZoomIn = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() * 1.5, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphRef.current) {
      graphRef.current.zoom(graphRef.current.zoom() / 1.5, 300);
    }
  };

  const handleFit = () => {
    if (graphRef.current) {
      graphRef.current.zoomToFit(500, 80);
    }
  };

  if (!graphData.nodes.length) {
    return (
      <div className="flex items-center justify-center h-[700px] text-[#A1A1AA]">
        加载中...
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-[700px] force-graph-container relative bg-[#FAFAFA] rounded-lg">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-colors"
          title="放大"
        >
          <ZoomIn size={18} className="text-[#52525B]" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-colors"
          title="缩小"
        >
          <ZoomOut size={18} className="text-[#52525B]" />
        </button>
        <button
          onClick={handleFit}
          className="p-2 bg-white rounded-lg shadow border border-[#E4E4E7] hover:bg-[#F4F4F5] transition-colors"
          title="适应视图"
        >
          <Maximize2 size={18} className="text-[#52525B]" />
        </button>
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        linkCanvasObject={linkCanvasObject}
        nodePointerAreaPaint={(node, color, ctx) => {
          if (!node.x || !node.y) return;
          const nodeSize = Math.sqrt(node.messageCount) / 2 + 6;
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize + 8, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        onNodeHover={(node) => setHoveredNode(node?.id || null)}
        onNodeClick={(node) => {
          if (graphRef.current) {
            graphRef.current.centerAt(node.x, node.y, 500);
            graphRef.current.zoom(2.5, 500);
          }
        }}
        onEngineStop={() => {
          if (graphRef.current) {
            graphRef.current.zoomToFit(400, 80);
          }
        }}
        cooldownTicks={300}
        cooldownTime={5000}
        linkDirectionalParticles={0}
        enableNodeDrag={true}
        backgroundColor="transparent"
        d3AlphaDecay={0.008}
        d3VelocityDecay={0.15}
        d3AlphaMin={0.001}
        warmupTicks={200}
      />
      
      {/* Tooltip */}
      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-[#E4E4E7]"
        >
          <div className="font-medium text-[#1A1A1A] text-lg">{hoveredNode}</div>
          <div className="text-sm text-[#52525B] mt-1">
            {characters[hoveredNode]?.message_count?.toLocaleString()} 条消息
          </div>
          <div className="text-sm text-[#52525B]">
            {characters[hoveredNode]?.scene_count} 个场景
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 text-xs text-[#A1A1AA]">
        拖拽节点 · 滚轮缩放 · 点击聚焦
      </div>
    </div>
  );
};

export default ForceGraph;
