// 转换数据
export const useConvertData = () => {
  // 转换地图数据
  const transformGeoJSON = json => {
    let features = json.features
    for (let i = 0; i < features.length; i++) {
      const item = features[i]
      // 将 Polygon 处理跟 MultiPolygon 一样的数据结构
      if (item.geometry.type === 'Polygon') {
        item.geometry.coordinates = [item.geometry.coordinates]
      }
    }
    return json
  }
  return {
    transformGeoJSON
  }
}
