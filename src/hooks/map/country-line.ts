import * as THREE from 'three'
import { Line2 } from 'three/examples/jsm/lines/Line2.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js'
import { deepMerge } from '../../utils'

export const useCountryLine = () => {
  // 创建国家平面边线
  const createCountryFlatLine = (
    data: any,
    materialOptions: ConstructorParameters<typeof THREE.LineBasicMaterial>[0],
    lineType: 'Line' | 'LineLoop' | 'LineSegments' | 'Line2' = 'LineLoop'
  ) => {
    let materialOpt = {
      color: 0x00ffff,
      linewidth: 1,
      depthTest: false
    }
    materialOpt = deepMerge(materialOpt, materialOptions)
    let material: InstanceType<typeof THREE.LineBasicMaterial> | InstanceType<typeof LineMaterial> =
      new THREE.LineBasicMaterial(materialOpt)
    if (lineType === 'Line2') {
      material = new LineMaterial(materialOpt)
    }
    let features = data.features
    let lineGroup = new THREE.Group()
    for (let i = 0; i < features.length; i++) {
      const element = features[i]
      const coordinates = element.geometry.coordinates
      for (let j = 0; j < coordinates.length; j++) {
        const coords = coordinates[j]

        // 每一块的点数据
        const points: (InstanceType<typeof THREE.Vector3> | number)[] = []
        if (lineType === 'Line2') {
          coords.forEach((polygon: any[]) => {
            polygon.forEach(item => {
              points.push(item[0], 0, -item[1])
            })
          })
        } else {
          coords.forEach((polygon: any[]) => {
            polygon.forEach(item => {
              points.push(new THREE.Vector3(item[0], item[1], 0))
            })
          })
        }
        // 根据每一块的点数据创建线条
        let line = createLine(points, material, lineType)
        // 将线条插入到组中
        lineGroup.add(line)
      }
    }
    // 返回所有线条
    return lineGroup
  }

  // 获取所有点位
  const getPoints = (data: any, y: number = 0, isVector3?: boolean) => {
    let features = data.features
    const points: (InstanceType<typeof THREE.Vector3> | number)[] = []
    for (let i = 0; i < features.length; i++) {
      const element = features[i]
      const coordinates = element.geometry.coordinates
      for (let j = 0; j < coordinates.length; j++) {
        coordinates[j].forEach((polygon: any[]) => {
          polygon.forEach(item => {
            if (isVector3) {
              points.push(new THREE.Vector3(item[0], y, -item[1]))
            } else {
              points.push(item[0], y, -item[1])
            }
          })
        })
      }
    }
    return points
  }

  // 根据点数据创建闭合的线条
  // 生成的线条类型 Line 线 | LineLoop 环线 | LineSegments 线段 | Line2
  const createLine = (
    points: (InstanceType<typeof THREE.Vector3> | number)[],
    material: InstanceType<typeof THREE.LineBasicMaterial> | InstanceType<typeof LineMaterial>,
    lineType: 'Line' | 'LineLoop' | 'LineSegments' | 'Line2' = 'LineLoop'
  ) => {
    let line:
      | InstanceType<typeof Line2>
      | InstanceType<typeof THREE.Line>
      | InstanceType<typeof THREE.LineLoop>
      | InstanceType<typeof THREE.LineSegments>
    if (lineType === 'Line2') {
      const geometry = new LineGeometry()
      geometry.setPositions(points as number[])
      line = new Line2(geometry, material as InstanceType<typeof LineMaterial>)
      line.name = 'countryLine2'

      // 计算线段距离
      line.computeLineDistances()
    } else {
      const geometry = new THREE.BufferGeometry()
      geometry.setFromPoints(points as InstanceType<typeof THREE.Vector3>[])
      line = new THREE[lineType](geometry, material)
      line.name = 'countryLine'
    }
    return line
  }
  return {
    createCountryFlatLine,
    getPoints
  }
}
