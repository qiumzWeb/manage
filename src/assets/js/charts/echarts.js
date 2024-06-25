// 引入核心组件
import * as echarts from 'echarts/core';
// 引入需要的主类型组件
import {
  LineChart,
  BarChart,
  PieChart
} from 'echarts/charts';
/**
 * 引入工具 : 可引入的工具如下
 */
//  GridSimpleComponent
//  GridComponent
//  PolarComponent
//  RadarComponent
//  GeoComponent
//  SingleAxisComponent
//  ParallelComponent
//  CalendarComponent
// GraphicComponent
// ToolboxComponent
// TooltipComponent
// AxisPointerComponent
// BrushComponent
// TitleComponent
// TimelineComponent
// MarkPointComponent
// MarkLineComponent
// MarkAreaComponent
// LegendComponent
// LegendScrollComponent
// LegendPlainComponent
// DataZoomComponent
// DataZoomInsideComponent
// DataZoomSliderComponent
// VisualMapComponent
// VisualMapContinuousComponent
// VisualMapPiecewiseComponent
// AriaComponent
// TransformComponent
// DatasetComponent
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  LegendScrollComponent,
  LegendPlainComponent,
  DataZoomComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  MarkLineComponent,
  MarkPointComponent,

} from 'echarts/components';

// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  BarChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  DataZoomComponent,
  LegendScrollComponent,
  LegendPlainComponent,
  DataZoomInsideComponent,
  DataZoomSliderComponent,
  MarkLineComponent,
  MarkPointComponent,
]);

export default echarts