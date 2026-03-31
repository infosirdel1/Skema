import { View } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";

export default function SimpleSchemaView({ tree }) {
  if (!tree) return null;

  const { nodes, edges } = tree;

  const nodeWidth = 100;
  const nodeHeight = 40;
  const spacingY = 80;
  const startX = 50;

  const positions = {};

  nodes.forEach((node, index) => {
    positions[node.id] = {
      x: startX,
      y: index * spacingY + 20
    };
  });

  return (
    <View>
      <Svg height={nodes.length * spacingY + 50} width="100%">
        
        {/* LINES */}
        {edges.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];

          if (!from || !to) return null;

          return (
            <Line
              key={i}
              x1={from.x + nodeWidth}
              y1={from.y + nodeHeight / 2}
              x2={to.x}
              y2={to.y + nodeHeight / 2}
              stroke="black"
              strokeWidth="2"
            />
          );
        })}

        {/* NODES */}
        {nodes.map((node) => {
          const pos = positions[node.id];

          return (
            <View key={node.id}>
              <Rect
                x={pos.x}
                y={pos.y}
                width={nodeWidth}
                height={nodeHeight}
                stroke="black"
                fill="white"
              />
              <SvgText
                x={pos.x + 10}
                y={pos.y + 25}
                fontSize="12"
              >
                {node.label}
              </SvgText>
            </View>
          );
        })}
      </Svg>
    </View>
  );
}
