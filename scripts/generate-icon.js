const fs = require('fs');
const path = require('path');

// 16x16 트레이 아이콘을 위한 간단한 PNG 생성 (base64)
// 파란색 배경에 흰색 "S" 글자
const iconBase64 = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA
7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFvSURBVFiF7ZY9
TsNAEIW/WUcRBQ0SBTU1EhdIlyugTpcbcBQuQM0FOAIdJTUlUkSBBBLCTrwUXq+dtR07ICRG2tLMzHv7
25md+WFJpXI6ZQFQAB3gFHgGXoAH4BY4B7rAWovYGngCboAnYAG8A1fAIXAADAETYAYsgeVGE/4VKIAI
nALHwBHQA/aANjAEhsAEeAZmwHvdglXrGfA1cAXsAR3gADgE+sAQuAdugBvgHlgBX3UKfgN+gTvgEngB
zAF74AT4BfaBI2ALjIA+0APugU/geZ0FPwF34Bx4BRZtYAj0gD5wBoyBMTABnoDXugX/AG7BFXAFXAJL
YATsA8fAAXAIHANj4BGYAs/AYh0L/gIugAvgHJgDt8A1cAVcAnNgBjwCj8AUeALm6yj4CbgB5sAFcAk8
AtO6Bb8AH8ANcAvcAO/AO3AHHAO9ugV/gb8w/wJvwCfwAfwAH8An8Am8AV/AW92C/wDugRvgHrgDvoE/
4B/4A/4AroE/4A/4Bv4Cf0AAlQWFDckAAAAASUVORK5CYII=`;

// 더 간단한 16x16 아이콘 (청록색 원형 배경에 S)
const simpleIconBase64 = `iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlz
AAALEgAACxIB0t1+/AAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE3SURB
VDiNpdM7S0JRGADg51zN0FQqGoJa2tqCoKmhqR8QRINDfy6CoKEpaImgxaGoqKmhJYgIIgjCJhVE
JBRRvNm9nRZv6r0XPXC353z83vOew/kPYRijKGICA+jCL77xjAc84Q1lHKKPh38CHzjHFjyYMGFC
wwQP29jANa5wijVs4hwXuMIaxrGCNRxhBUdYxRa2cYJdTKKAKTSwhQrm0MAcathDCQuYQR3TaGIO
i1jEPOaxgEXUMIc+euj+Z/APVZxhElMYxxj6MIQR9KEPI+hBF4ZxjBPcohP76MQu2rCDVmxhE5s4
xAYasYkGNnCIBqpYQxXtqKALHejGJ97xgQ+84B1veMMrXvCKN7zhDW94xyte8YI3fOAZz3jCM97x
gU984hMf+MInPvGBT3zhB1/4wh++8YUf/OAXv/jFL/4AqDhhIqvvCX8AAAAASUVORK5CYII=`;

// public 폴더에 아이콘 저장
const publicDir = path.join(__dirname, '..', 'public');
const iconPath = path.join(publicDir, 'tray-icon.png');

// base64 디코드하여 파일로 저장
const iconData = Buffer.from(simpleIconBase64.replace(/\s/g, ''), 'base64');
fs.writeFileSync(iconPath, iconData);

console.log('✅ 트레이 아이콘이 생성되었습니다:', iconPath);
