import * as THREE from 'three'

interface UseCountryLine {
  createCountryFlatLine: (
    data: any,
    materialOptions: ConstructorParameters<typeof THREE.LineBasicMaterial>[0],
    lineType: 'Line' | 'LineLoop' | 'LineSegments' | 'Line2'
  ) => THREE.Group
  getPoints: (
    data: any,
    y: number,
    isVector3?: boolean
  ) => (THREE.Vector3 | number)[]
}

// 地图国界线
export declare function useCountryLine(): UseCountryLine
