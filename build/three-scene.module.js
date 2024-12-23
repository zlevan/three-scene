
import * as THREE from 'three';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { PathPointList, PathTubeGeometry, PathGeometry } from 'three-cruise-path';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// 判断指定类型
const isType = (type, value) => {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
};
// 判断是否为对象
const isObject = (value) => {
    return isType('Object', value);
};
// 判断 dom 元素
const isDOM = (obj) => {
    return (obj &&
        (typeof HTMLElement === 'object'
            ? obj instanceof HTMLElement
            : obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string'));
};
/**
 * @description deepClone() 深拷贝-最终版：解决循环引用的问题
 * @param { * } target 对象
 * @example
 *      const obj1 = {
 *          a: 1,
 *          b: ["e", "f", "g"],
 *          c: { h: { i: 2 } },
 *      };
 *      obj1.b.push(obj1.c);
 *      obj1.c.j = obj1.b;
 *
 *      const obj2 = deepClone(obj1);
 *      obj2.b.push("h");
 *      console.log(obj1, obj2);
 *      console.log(obj2.c === obj1.c);
 */
const deepClone = (target, map = new Map()) => {
    // target 不能为空，并且是一个对象
    if (target != null && isObject(target)) {
        // 在克隆数据前，进行判断是否克隆过,已克隆就返回克隆的值
        let cache = map.get(target);
        if (cache) {
            return cache;
        }
        // 判断是否为数组
        const isArray = Array.isArray(target);
        let result = isArray ? [] : {};
        // 将新结果存入缓存中
        cache = map.set(target, result);
        // 如果是数组
        if (isArray) {
            // 循环数组，
            target.forEach((item, index) => {
                // 如果item是对象，再次递归
                result[index] = deepClone(item, cache);
            });
        }
        else {
            // 如果是对象
            Object.keys(target).forEach(key => {
                if (isObject(result[key])) {
                    result[key] = deepClone(target[key], cache);
                }
                else {
                    result[key] = target[key];
                }
            });
        }
        return result;
    }
    else {
        return target;
    }
};
// 深度合并
const deepMerge = (target, source) => {
    target = deepClone(target);
    for (let key in source) {
        if (key in target) {
            // 对象的处理
            if (isObject(source[key])) {
                if (!isObject(target[key])) {
                    target[key] = source[key];
                }
                else {
                    target[key] = deepMerge(target[key], source[key]);
                }
            }
            else {
                target[key] = source[key];
            }
        }
        else {
            target[key] = source[key];
        }
    }
    return target;
};
/**
 * 校验url地址是否正确
 * @param { string } url 需要校验的 url 地址
 * @return { boolean } 校验结果
 * @example
 * checkUrl( 'https://www.baidu.com' )
 */
const checkUrl = (url) => {
    !url && (url = '');
    let regex = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/;
    if (!regex.test(url)) {
        const reg = /^(https?:\/\/)(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::\d{1,5})?(?:[/?#]\S*)?$/;
        return reg.test(url);
    }
    // return false
    return true;
};
// 获取地址
const getUrl = (url, baseUrl = '') => {
    // 判断数组
    if (Array.isArray(url)) {
        return url.map(u => getUrl(u, baseUrl));
    }
    // 检查是否为完整链接 不是则拼接域名地址
    if (!checkUrl(url) && url.indexOf(baseUrl) < 0) {
        return baseUrl + url;
    }
    return url;
};

var defOptions = {
    container: document.body,
    width: window.innerWidth,
    height: window.innerHeight,
    // 基础地址（资源地址）
    baseUrl: '',
    // 背景 (背景透明需要 render 参数 alpha 为 true)
    bgColor: null,
    // 背景图
    bgUrl: null,
    // 环境
    env: null,
    // 缩放(父元素缩放)
    scale: 1,
    // 雾
    fog: {
        visible: false,
        // 近
        near: 100,
        // 远
        far: 1000
    },
    // 渲染器配置
    render: {
        // 是否开启反锯齿，设置为true开启反锯齿
        antialias: true,
        // 透明度
        // alpha: true,
        // 设置对数深度缓存
        // 解决 模型相接处或某些区域出现频闪问题或内容被相邻近元素覆盖掉的情况
        logarithmicDepthBuffer: true,
        // 截图设置, true 时性能会下降
        preserveDrawingBuffer: false
    },
    // 控制
    controls: {
        // 是否开启
        visible: true,
        // 自动旋转
        autoRotate: false,
        // 自动旋转速度
        autoRotateSpeed: 2.0,
        // 阻尼(惯性)
        enableDamping: false,
        // 阻尼系数，鼠标灵敏度
        dampingFactor: 0.25,
        // 相机平移（右键拖拽）
        enablePan: true,
        // 相机旋转
        enableRotate: true,
        // 缩放
        enableZoom: true,
        // 旋转角度上限
        maxAzimuthAngle: Infinity,
        // 旋转角度下限
        minAzimuthAngle: Infinity,
        // 相机最近距离
        minDistance: 1,
        // 相机最远距离
        maxDistance: 2000,
        // 垂直角度下限
        minPolarAngle: 0,
        // 垂直角度上限
        maxPolarAngle: Math.PI,
        // 目标移动半径
        maxTargetRadius: Infinity,
        // 旋转速度
        rotateSpeed: 1,
        // 空间内平移/垂直平面平移
        screenSpacePanning: true
    },
    // 环境光
    ambientLight: {
        visible: true,
        color: 0xffffff,
        // 强度
        intensity: 1.5
    },
    // 平行光
    directionalLight: {
        visible: true,
        // 辅助
        helper: false,
        // 坐标
        position: [500, 1000, 800],
        position2: [-500, 800, -800],
        // 平行光 2 开启
        light2: true,
        // 颜色
        color: 0xffffff,
        // 强度
        intensity: 1.5
    },
    // 相机
    camera: {
        // 辅助
        helper: false,
        // 近
        near: 1,
        // 远
        far: 10000,
        position: [-350, 510, 700]
    },
    // 巡航
    cruise: {
        visible: false,
        // 激活
        enabled: false,
        // 运行中
        runing: false,
        // 辅助
        helper: false,
        // 点位
        points: [],
        // 分段
        segment: 2,
        // 曲线张力
        tension: 0,
        // 基础地址
        baseUrl: '',
        // 贴图地址
        // mapUrl: '',
        // 贴图重复
        repeat: [0.1, 1],
        // 宽度
        width: 15,
        // 动画速度
        speed: 1,
        // 贴图速度
        mapSpeed: 0.006,
        //  巡航偏差
        offset: 10,
        // 系数
        factor: 1,
        // 自动巡航(可从动画函数执行机器人巡航)
        auto: false,
        // 帧动画回调
        animateBack: void 0
    },
    // 网格
    grid: {
        visible: false,
        opacity: 0.3,
        transparent: true,
        width: 800,
        // 等分数
        divisions: 80,
        // 中心线颜色
        centerLineColor: 0xa1a1a1,
        // 网格颜色
        gridColor: 0xa1a1a1,
        // 交叉
        fork: false,
        forkSize: 1.4,
        forkColor: 0xa1a1a1
    },
    axes: {
        visible: false,
        size: 50
    }
};

// 获取贴图地址
const getTextturesUrl = (jpg) => {
    return new URL(`../assets/imgs/texttures/${jpg}`, import.meta.url).href;
};

const getOpts = () => ({
    visible: true,
    // 激活(可识别键盘操作)
    enabled: false,
    // 运行中
    runing: false,
    // 辅助
    helper: false,
    // 点位
    points: [],
    // 分段
    segment: 2,
    // 闭合
    close: true,
    // 曲线张力
    tension: 0,
    // 基础地址
    baseUrl: '',
    // 贴图地址
    mapUrl: getTextturesUrl('arrow.png'),
    // 贴图重复
    repeat: [0.1, 1],
    // 宽度
    width: 15,
    // 动画速度
    speed: 1,
    // 贴图速度
    mapSpeed: 0.006,
    //  巡航偏差
    offset: 10,
    // 系数
    factor: 1,
    // 索引
    index: 0,
    // 自动巡航
    auto: false,
    // 管路
    tube: false,
    // 材质颜色
    color: 0xffffff,
    // 半径 (管路模式未管路半径、平面模式为拐角半径)
    radius: 1,
    // 分段
    radialSegments: 1,
    // 帧动画回调
    animateBack: void 0
});
// 巡航
const useCruise = () => {
    // 曲线
    let cruiseCurve;
    // 贴图
    // let texture: InstanceType<typeof THREE.TextureLoader>
    let texture;
    // 辅助眼睛
    let eye;
    let _options = getOpts();
    const createCruise = (options = {}, renderer) => {
        // 默认参数
        _options = deepMerge(getOpts(), options);
        const { points, tension, mapUrl, baseUrl, repeat, width, helper, close, tube, color, radius, radialSegments } = _options;
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            newPoints.push(new THREE.Vector3(p[0], p[1], p[2]));
        }
        // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
        // 曲线类型：centripetal、chordal和catmullrom
        cruiseCurve = new THREE.CatmullRomCurve3(newPoints, close, 'catmullrom', tension !== null && tension !== void 0 ? tension : 0);
        cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(), close, 'catmullrom', tension !== null && tension !== void 0 ? tension : 0);
        const group = new THREE.Group();
        texture = new THREE.TextureLoader().load(getUrl(mapUrl, baseUrl), tx => {
            // 贴图在水平方向上允许重复
            tx.wrapS = THREE.RepeatWrapping;
            tx.repeat.x = repeat[0];
            tx.repeat.y = repeat[1];
            // 向异性
            tx.anisotropy = renderer.capabilities.getMaxAnisotropy();
        });
        // 材质
        const mat = new THREE.MeshPhongMaterial({
            color,
            map: texture,
            opacity: 0.9,
            transparent: true,
            // depthWrite: false,
            depthTest: !false,
            side: THREE.FrontSide
            // blending: THREE.AdditiveBlending
        });
        // 向量
        const up = new THREE.Vector3(0, 1, 0);
        const pathPoints = new PathPointList();
        // 点位集合、拐角半径、拐角分段、方向向量、闭合
        pathPoints.set(getAllPoints(), radius, radialSegments, up, false);
        const geometry = tube ? new PathTubeGeometry() : new PathGeometry();
        geometry.update(pathPoints, tube
            ? {
                radius, // 半径
                radialSegments, // 分段
                progress: 1, // 进度
                startRad: 0
            }
            : {
                width: width, // 宽度
                arrow: false, // 箭头
                progress: 1, // 进度
                side: 'both' // left/right/both  左/右/两者
            }
        // false
        );
        console.log(geometry);
        const mesh = new THREE.Mesh(geometry, mat);
        group.add(mesh);
        group.name = 'cruise';
        if (helper) {
            createHelper(group, newPoints);
        }
        group.renderOrder = 99;
        return group;
    };
    // 辅助
    const createHelper = (group, points) => {
        eye = new THREE.Mesh(new THREE.SphereGeometry(2), new THREE.MeshBasicMaterial({
            color: 0x000000,
            opacity: 0.8,
            depthTest: false,
            transparent: true
        }));
        group.add(eye);
        const geo = new THREE.BufferGeometry().setFromPoints(points.concat(points[0]));
        const material = new THREE.LineBasicMaterial({
            color: 0x0000ff,
            opacity: 1,
            depthTest: false,
            transparent: true
        });
        const mesh = new THREE.Line(geo, material);
        group.add(mesh);
        const tubeGeometry = new THREE.TubeGeometry(cruiseCurve, 100, _options.width / 2, 3, true);
        const tubeMat = new THREE.MeshLambertMaterial({
            color: 0xff00ff,
            opacity: 0.1,
            depthTest: false,
            transparent: true
        });
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMat);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0ff0,
            opacity: 0.3,
            wireframe: true,
            depthTest: false,
            transparent: true
        });
        const wireframe = new THREE.Mesh(tubeGeometry, wireframeMaterial);
        tubeMesh.add(wireframe);
        group.add(tubeMesh);
    };
    // 长度
    const getCruiseLen = () => { var _a; return ((_a = _options.segment) !== null && _a !== void 0 ? _a : 2) * 900; };
    // 所有点位
    const getAllPoints = () => cruiseCurve === null || cruiseCurve === void 0 ? void 0 : cruiseCurve.getPoints(getCruiseLen());
    // 偏移坐标
    const getOffsetPoint = (offset, pos) => {
        return new THREE.Vector3(pos.x, pos.y + offset, pos.z);
    };
    // 更新参数
    const updateCruise = (options = {}) => {
        // 默认参数
        _options = deepMerge(_options, options);
    };
    // 巡航动画
    const cruiseAnimate = (camera) => {
        if (!camera)
            return;
        if (!cruiseCurve)
            return;
        const { mapSpeed, speed, factor, enabled, runing, offset, helper, auto, animateBack } = _options;
        if (texture)
            texture.offset.x -= mapSpeed;
        // 非自动、停止或非激活
        if (!auto && (!runing || !enabled))
            return;
        // 自动、激活且运行
        if (auto || (runing && enabled))
            _options.index += factor * speed;
        const looptime = getCruiseLen();
        const t = (_options.index % looptime) / looptime;
        const oft = 0.001;
        let ts = t + oft;
        if (ts > 1)
            ts = ts - 1;
        const pos = cruiseCurve.getPointAt(ts);
        if (helper && eye) {
            const nPos = getOffsetPoint(offset, pos);
            eye.position.copy(nPos);
        }
        const _pos = getOffsetPoint(offset, cruiseCurve.getPointAt(t));
        if (!auto || (runing && enabled)) {
            camera.position.copy(_pos);
            const at = getOffsetPoint(offset, pos);
            camera._lookAt_ = at;
            camera.lookAt(at);
        }
        if (typeof animateBack === 'function')
            animateBack(_pos, pos, cruiseCurve, t);
    };
    const onKeyDown = (e) => {
        if (!_options.enabled)
            return;
        const keyCode = e.keyCode;
        switch (keyCode) {
            // 前进
            case 38:
            case 87:
                if (_options.runing) {
                    _options.factor *= 1.5;
                    if (_options.factor > 10)
                        _options.factor = 10;
                }
                else {
                    _options.index += 5;
                }
                break;
            // 后退
            case 83:
            case 40:
                if (!_options.runing) {
                    _options.index -= 5;
                    if (_options.index < 0) {
                        _options.index = getCruiseLen();
                    }
                }
                break;
        }
    };
    const onKeyUp = (e) => {
        if (!_options.enabled)
            return;
        _options.factor = 1;
        const keyCode = e.keyCode;
        switch (keyCode) {
            // 暂停
            case 32:
                _options.runing = !_options.runing;
                break;
            // 前进
            case 38:
            case 87:
                if (!_options.runing) {
                    _options.index += 10;
                }
                break;
            // 后退
            case 83:
            case 40:
                if (!_options.runing) {
                    _options.index -= 10;
                    if (_options.index < 0) {
                        _options.index = getCruiseLen();
                    }
                }
                break;
        }
    };
    const bindEvent = () => {
        window.addEventListener('keydown', onKeyDown, false);
        window.addEventListener('keyup', onKeyUp, false);
    };
    const removeEvent = () => {
        window.removeEventListener('keyup', onKeyUp);
        window.removeEventListener('keydown', onKeyDown);
    };
    return {
        createCruise,
        updateCruise,
        cruiseAnimate,
        bindEvent,
        removeEvent
    };
};

// 网格交叉
const useGrid = () => {
    const createFork = (options = {}) => {
        const { width = 800, divisions = 80, forkSize = 1.4, forkColor = 0xa1a1a1 } = options;
        let step = width / divisions, start = -width / 2;
        const group = new THREE.Group();
        for (let i = 0; i <= divisions; i++) {
            for (let j = 0; j <= divisions; j++) {
                const x = start + i * step;
                const z = start + j * step;
                const geo = new THREE.PlaneGeometry(forkSize, forkSize / 5);
                // 边框材质
                const mat = new THREE.MeshLambertMaterial({
                    color: forkColor,
                    transparent: true,
                    opacity: 0.9
                });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.rotateX(-Math.PI * 0.5);
                mesh.position.set(x, 0, z);
                const mesh2 = mesh.clone();
                mesh2.rotateZ(Math.PI * 0.5);
                group.add(mesh, mesh2);
            }
        }
        return group;
    };
    return {
        createFork
    };
};

var _Scene_instances, _Scene_resetCruiseOpts;
const { createCruise, cruiseAnimate, updateCruise, bindEvent, removeEvent } = useCruise();
const { createFork } = useGrid();
class Scene {
    constructor(options = {}) {
        _Scene_instances.add(this);
        // 默认配置
        const defaultOpts = defOptions;
        // 配置
        this.options = deepMerge(defaultOpts, options);
        Scene.total++;
        this.pointer = {
            tsp: 0,
            isClick: false
        };
        // 容器
        if (isDOM(this.options.container)) {
            this.container = this.options.container;
        }
        else {
            this.container = document.querySelector(this.options.container);
        }
        this.options.width = this.container.offsetWidth;
        this.options.height = this.container.offsetHeight;
        this.scene = new THREE.Scene();
        this.renderer = this.initRenderer();
        this.baseCamera = this.initCamera();
        this.controls = this.initControls();
        this.init();
        this.initCruise();
        console.log(this);
    }
    get camera() {
        const { visible, runing, auto } = this.options.cruise;
        if (!visible || !this.cruiseCamera)
            return this.baseCamera;
        // 自动巡航
        if (auto) {
            return runing ? this.cruiseCamera : this.baseCamera;
        }
        // 非自动巡航且运行中
        return runing ? this.cruiseCamera : this.baseCamera;
    }
    init() {
        this.initLight();
        this.initGrid();
        this.initAxes();
        this.initModel();
    }
    // 运行
    run() {
        this.loop();
    }
    // 循环
    loop() {
        this.animationId = window.requestAnimationFrame(() => {
            this.loop();
        });
        this.animate();
        this.modelAnimate();
    }
    animate() {
        var _a;
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
        // 控制相机旋转缩放的更新
        if (this.options.controls.visible)
            (_a = this.controls) === null || _a === void 0 ? void 0 : _a.update();
        cruiseAnimate(this.cruiseCamera);
        TWEEN.update();
    }
    initModel() {
        // 业务代码
    }
    modelAnimate() { }
    // 渲染器
    initRenderer() {
        const { width, height, bgColor, bgUrl, env } = this.options;
        // 创建渲染对象
        const renderer = new THREE.WebGLRenderer(this.options.render);
        // renderer.setClearAlpha( 0 )
        // 环境
        if (env) {
            this.setEnvironment(env);
        }
        // 背景
        if (bgUrl) {
            this.setBgTexture(bgUrl);
        }
        else {
            this.setBgColor(bgColor);
        }
        if (this.options.fog.visible) {
            const { color, near, far } = this.options.fog;
            this.scene.fog = new THREE.Fog(color !== null && color !== void 0 ? color : this.scene.background, near, far);
            // this.scene.fog = new THREE.FogExp2(0xefd1b5, 0.0005)
        }
        // 渲染顺序
        // 开启后模型可以设置 renderOrder 值，依次渲染
        renderer.sortObjects = true;
        // 渲染开启阴影 ！！！！
        renderer.shadowMap.enabled = true;
        // THREE.BasicShadowMap 性能很好，但质量很差
        // THREE.PCFShadowMap 性能较差，但边缘更光滑
        // THREE.PCFSoftShadowMap 性能较差，但边缘更柔软
        // THREE.VSMShadowMap 更低的性能，更多的约束，可能会产生意想不到的结果
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 设置渲染尺寸
        renderer.setSize(width, height);
        // 设置canvas的分辨率
        renderer.setPixelRatio(window.devicePixelRatio);
        // 画布插入容器
        this.container.appendChild(renderer.domElement);
        return renderer;
    }
    // 灯光
    initLight() {
        const { ambientLight, directionalLight } = this.options;
        // 环境光
        if (ambientLight.visible) {
            const ambLight = new THREE.AmbientLight(ambientLight.color, ambientLight.intensity);
            this.addObject(ambLight);
        }
        // 平行光
        if (directionalLight.visible) {
            const direLight = this.createDirectionalLight();
            const [x = 0, y = 0, z = 0] = directionalLight.position;
            direLight.position.set(x, y, z);
            this.addObject(direLight);
            if (directionalLight.helper) {
                const dirLightHelper = new THREE.DirectionalLightHelper(direLight, 1);
                this.addObject(dirLightHelper);
            }
            // const pointLight = new THREE.PointLight(0xffffff, 100000, 1000)
            // pointLight.position.set(0, 200, 0)
            // pointLight.visible = true
            // this.addObject(pointLight)
            if (directionalLight.light2) {
                const dirLight2 = this.createDirectionalLight(false);
                const [x = 0, y = 0, z = 0] = directionalLight.position2;
                dirLight2.position.set(x, y, z);
                this.addObject(dirLight2);
                if (directionalLight.helper) {
                    const dirLigh2tHelper = new THREE.DirectionalLightHelper(dirLight2, 1);
                    this.addObject(dirLigh2tHelper);
                }
            }
        }
    }
    // 创建平行光
    createDirectionalLight(castShadow = true, s = 2000, size = 4096, near = 1, far = 20000) {
        const { color, intensity } = this.options.directionalLight;
        // 平行光
        const dirLight = new THREE.DirectionalLight(color, intensity);
        // dirLight.position.set(0)
        if (castShadow) {
            dirLight.shadow.mapSize.setScalar(size);
            dirLight.shadow.bias = -1e-5;
            dirLight.shadow.normalBias = 1e-2;
            dirLight.castShadow = castShadow;
            // 设置阴影贴图模糊度
            const shadowCam = dirLight.shadow.camera;
            // shadowCam.radius = 10
            shadowCam.near = near;
            shadowCam.far = far;
            shadowCam.top = shadowCam.right = s;
            shadowCam.left = shadowCam.bottom = -s;
            // 更新矩阵
            shadowCam.updateProjectionMatrix();
        }
        return dirLight;
    }
    // 相机
    initCamera() {
        const { width, height, camera } = this.options;
        // 透视投影相机对象 参数（现场角度，窗口长宽比，开始渲染位置，结束渲染位置）
        let cam = new THREE.PerspectiveCamera(36, width / height, camera.near, camera.far);
        if (camera.orthogonal) {
            let k = width / height, s = 260;
            // 创建相机对象 参数（左边界，右边界，上边界，下边界，开始渲染位置，结束渲染位置）
            cam = new THREE.OrthographicCamera(-s * k, s * k, s, -s, camera.near, camera.far);
        }
        // 相机位置
        cam.position.set(...camera.position);
        // 未添加控制轨道则需要设置 lookat 否则渲染无效
        cam.lookAt(0, 0, 0);
        if (camera.helper) {
            const helper = new THREE.CameraHelper(cam);
            this.addObject(helper);
        }
        return cam;
    }
    // 控制器
    initControls() {
        const controls = this.options.controls;
        if (!controls.visible)
            return;
        // 创建控件
        const ctrl = new OrbitControls(this.camera, this.renderer.domElement);
        Object.keys(controls).forEach(key => {
            // @ts-ignore
            ctrl[key] = controls[key];
        });
        // 聚焦坐标
        ctrl.target.set(0, 0, 0);
        // 保存状态
        ctrl.saveState();
        return ctrl;
    }
    // 巡航
    initCruise() {
        const { visible } = this.options.cruise;
        if (!visible)
            return;
        this.cruiseCamera = this.initCamera();
        __classPrivateFieldGet(this, _Scene_instances, "m", _Scene_resetCruiseOpts).call(this);
    }
    // 网格
    initGrid() {
        const grid = this.options.grid;
        if (!grid.visible)
            return;
        const { width, divisions, centerLineColor, gridColor, opacity, transparent, fork } = grid;
        // 网格宽度、等分数、中心线颜色、网格颜色
        const gd = new THREE.GridHelper(width, divisions, centerLineColor, gridColor);
        gd.material.opacity = opacity;
        gd.material.transparent = transparent;
        this.grid = gd;
        this.addObject(gd);
        // 交叉
        if (fork) {
            const group = createFork(grid);
            group.name = '辅助交叉点';
            // @ts-ignore
            group._isGridFork_ = true;
            this.addObject(group);
        }
    }
    // 坐标辅助器
    initAxes() {
        if (!this.options.axes.visible)
            return;
        // 辅助坐标器
        const axesHelper = new THREE.AxesHelper(this.options.axes.size);
        this.addObject(axesHelper);
    }
    // 创建地面
    createGround(sizeX = 5000, sizeY, color = 0xb2dbdb) {
        sizeY = sizeY === void 0 ? sizeX : sizeY;
        const geo = new THREE.PlaneGeometry(sizeX, sizeY);
        const mat = new THREE.MeshPhongMaterial({
            color,
            shininess: 10 // 高亮阈值
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = 'ground';
        mesh.rotation.x = Math.PI * 1.5;
        // 接收阴影
        mesh.receiveShadow = true;
        return mesh;
    }
    // 创建时间
    createClock() {
        this.clock = new THREE.Clock();
    }
    // 设置巡航点位
    setCruisePoint(points) {
        this.options.cruise.points = points;
        this.createCruise();
    }
    // 创建巡航组
    createCruise() {
        const { visible, points } = this.options.cruise;
        if (!visible)
            return;
        if (this.cruiseGroup) {
            this.disposeObj(this.cruiseGroup);
        }
        bindEvent();
        if (!points || points.length == 0)
            return;
        const group = createCruise(this.options.cruise, this.renderer);
        this.cruiseGroup = group;
        group.visible = false;
        this.addObject(group);
    }
    // 巡航启动或关闭
    toggleCruise(close) {
        let { visible, runing, auto } = this.options.cruise;
        if (!visible)
            return;
        runing = close != void 0 ? close : runing;
        this.options.cruise.runing = !runing;
        this.options.cruise.enabled = !runing;
        this.controls && (this.controls.enabled = auto || runing);
        this.cruiseGroup && (this.cruiseGroup.visible = !runing);
        updateCruise(this.options.cruise);
    }
    // 开启或关闭巡航深度测试
    toggleCruiseDepthTest(depthTest) {
        if (!this.cruiseGroup)
            return;
        this.cruiseGroup.traverse((el) => {
            if (el.isMesh || el.isLine) {
                el.material.depthTest = depthTest != void 0 ? depthTest : !el.material.depthTest;
            }
        });
    }
    // 设置缩放
    setScale(s) {
        this.options.scale = s;
    }
    // 设置环境
    setEnvironment(env) {
        new RGBELoader().load(getUrl(env, this.options.baseUrl), texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            // 将加载的材质texture设置给背景和环境
            this.scene.environment = texture;
        });
    }
    // 设置背景图
    setBgTexture(bgUrl) {
        if (Array.isArray(bgUrl)) {
            const loader = new THREE.CubeTextureLoader();
            const env = loader.load(getUrl(bgUrl, this.options.baseUrl));
            // 设置背景
            this.scene.background = env;
        }
        else {
            this.scene.background = new THREE.TextureLoader().load(getUrl(bgUrl));
        }
    }
    // 设置背景色
    setBgColor(color) {
        this.scene.background = color ? new THREE.Color(color) : null;
    }
    // 绑定事件
    bindEvent() {
        const dom = this.renderer.domElement;
        dom.addEventListener('dblclick', this.onDblclick.bind(this));
        dom.addEventListener('pointerdown', this.onPointerDown.bind(this));
        dom.addEventListener('pointermove', this.onPointerMove.bind(this));
        dom.addEventListener('pointerup', this.onPointerUp.bind(this));
    }
    onDblclick(_e) { }
    onPointerDown(e) {
        this.pointer.isClick = true;
        this.pointer.tsp = e.timeStamp;
    }
    onPointerMove(_e) { }
    onPointerUp(_e) {
        this.pointer.isClick = false;
    }
    // 导出图片
    exportImage() {
        const link = document.createElement('a');
        link.download = 'render.png';
        link.href = this.renderer.domElement.toDataURL().replace('image/png', 'image/octet-stream');
        link.click();
    }
    // 获取场景坐标
    getPosition() {
        var _a, _b;
        console.log('camera.position', this.camera.position);
        console.log('controls.target', (_a = this.controls) === null || _a === void 0 ? void 0 : _a.target);
        return {
            position: this.camera.position,
            target: (_b = this.controls) === null || _b === void 0 ? void 0 : _b.target
        };
    }
    // 判断相机位置是否移动
    isCameraMove(to, distance = 1) {
        const pos = this.camera.position;
        // 坐标差距小于 threshold 则未移动
        return (Math.abs(pos.x - to.x) < distance &&
            Math.abs(pos.y - to.y) < distance &&
            Math.abs(pos.z - to.z) < distance);
    }
    // 添加对象到场景
    addObject(...objects) {
        this.scene.add(...objects);
    }
    // 控制保存
    controlSave() {
        var _a;
        (_a = this.controls) === null || _a === void 0 ? void 0 : _a.saveState();
    }
    // 控制重置
    controlReset() {
        var _a;
        (_a = this.controls) === null || _a === void 0 ? void 0 : _a.reset();
        this.toggleCruise(true);
    }
    // 获取有效的目标点 并设置中心点
    getValidTargetPosition(config, _to, _target, defaultTo = {
        x: -104,
        y: 7,
        z: 58
    }) {
        const to = _to || config.to || defaultTo;
        const target = _target || config.target || { x: 0, y: 0, z: 0 };
        const ctr = this.controls;
        if (ctr && ctr.target) {
            // 中心点位
            ctr.target.set(target.x, target.y, target.z);
        }
        return to;
    }
    // 重置画布大小
    resize() {
        // 重新设置宽高
        this.options.width = this.container.offsetWidth || window.innerWidth;
        this.options.height = this.container.offsetHeight || window.innerHeight;
        const { width, height, camera } = this.options;
        const k = width / height;
        if (!camera.orthogonal) {
            // @ts-ignore
            this.baseCamera.aspect = k;
        }
        this.baseCamera.updateProjectionMatrix();
        // 巡航相机
        if (this.cruiseCamera) {
            if (!camera.orthogonal) {
                // @ts-ignore
                this.cruiseCamera.aspect = k;
            }
            this.cruiseCamera.updateProjectionMatrix();
        }
        this.renderer.setSize(width, height);
    }
    // 停止动画
    stopAnimate() {
        window.cancelAnimationFrame(this.animationId);
    }
    // 清除对象
    clear(obj) {
        if (!obj || !obj.traverse)
            return;
        obj.traverse((el) => {
            if (el.material)
                el.material.dispose();
            if (el.geometry)
                el.geometry.dispose();
            el === null || el === void 0 ? void 0 : el.clear();
        });
        obj === null || obj === void 0 ? void 0 : obj.clear();
    }
    // 销毁对象
    disposeObj(obj) {
        if (!obj || !obj.traverse)
            return;
        obj.traverse((el) => {
            if (el.material)
                el.material.dispose();
            if (el.geometry)
                el.geometry.dispose();
            el === null || el === void 0 ? void 0 : el.clear();
        });
        obj === null || obj === void 0 ? void 0 : obj.clear();
        this.scene.remove(obj);
    }
    // 销毁
    dispose() {
        var _a;
        removeEvent();
        this.stopAnimate();
        try {
            THREE.Cache.clear();
            this.disposeObj(this.scene);
            this.scene.clear();
            this.renderer.dispose();
            this.renderer.forceContextLoss();
            // this.renderer.content = null
            let gl = this.renderer.domElement.getContext('webgl');
            gl && ((_a = gl.getExtension('WEBGL_lose_context')) === null || _a === void 0 ? void 0 : _a.loseContext());
            this.disposeObj(this.cruiseGroup);
            this.disposeObj(this.grid);
            if (this.controls)
                this.controls.dispose();
            // @ts-ignore
            this.scene = void 0;
            // @ts-ignore
            this.renderer = void 0;
            // @ts-ignore
            this.baseCamera = void 0;
            this.cruiseCamera = void 0;
            this.controls = void 0;
            this.grid = void 0;
            this.cruiseGroup = void 0;
            this.container.innerHTML = '';
        }
        catch (e) {
            console.log(e);
        }
    }
}
_Scene_instances = new WeakSet(), _Scene_resetCruiseOpts = function _Scene_resetCruiseOpts() {
    const cruise = this.options.cruise;
    cruise.enabled = false;
    cruise.runing = false;
    // const lookAtPos = this.controls.target
    // this.camera.lookAt(lookAtPos)
    // this.camera._lookAt_ = lookAtPos
    if (cruise.baseUrl) {
        cruise.baseUrl = this.options.baseUrl;
    }
    cruise.factor = 1;
};
// 静态属性
Scene.total = 0;

const add = (a, b) => a + b;

export { Scene, add };
