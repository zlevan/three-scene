
import * as THREE from 'three';
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { CSS3DRenderer, CSS3DSprite, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import { ref, reactive, toRef } from 'vue';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module';
import { PathPointList, PathTubeGeometry, PathGeometry } from 'three-cruise-path';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { GLTFLoader as GLTFLoader$1 } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader as DRACOLoader$1 } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

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

function __awaiter(thisArg, _arguments, P, generator) {
		function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
		return new (P || (P = Promise))(function (resolve, reject) {
				function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
				function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
				function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
				step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
}

function __classPrivateFieldGet(receiver, state, kind, f) {
		if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
		if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
		return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
		var e = new Error(message);
		return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

// 获取贴图地址
const getTextturesUrl = (jpg) => {
    return new URL(`../assets/imgs/texttures/${jpg}`, import.meta.url).href;
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

/**
 * 换算单位(汉字单位-四舍五入)
 * @param { number } num 需转换汉字的数值
 * @param { number } precision 数值精度	默认：2
 * @return { number | string } 换算后的值
 * @example
 * numConverter( 1111555 )
 */
const numConverter = (num = 0, precision = 2) => {
    if (Math.abs(num) >= 100000000) {
        const n = num / 100000000;
        return n.toFixed(precision) * 1 + '亿';
    }
    else if (Math.abs(num) >= 10000) {
        const n = num / 10000;
        return n.toFixed(precision) * 1 + '万';
    }
    else {
        const n = num;
        return n.toFixed(precision) * 1;
    }
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

// 删除 db
const deleteDB = (dbName) => {
    return new Promise(resolve => {
        // 删除数据库
        const request = window.indexedDB.deleteDatabase(dbName);
        console.log(request);
        request.onsuccess = _ev => {
            resolve(true);
        };
        request.onerror = ev => {
            console.log('删除失败', ev);
            resolve(false);
        };
    });
};
//获取当前的版本号
const getDBVersion = (dbName, version, tbName) => {
    return new Promise(resolve => {
        //打开数据库
        var request = window.indexedDB.open(dbName);
        // 数据库成功打开时触发onsuccess事件
        request.onsuccess = (event) => {
            const db = event.target.result;
            const ver = db.version;
            // 关闭
            db.close();
            if (ver !== version) {
                deleteDB(dbName).then(b => {
                    resolve(b ? version : ver);
                });
            }
            else {
                // 判断表是否存在
                if (!db.objectStoreNames.contains(tbName)) {
                    deleteDB(dbName).then(b => {
                        resolve(b ? version : ver);
                    });
                }
                else {
                    resolve(ver);
                }
            }
        };
    });
};
// 创建数据库
const createDB = (tbName_1, ...args_1) => __awaiter(void 0, [tbName_1, ...args_1], void 0, function* (tbName, dbName = 'THREE__MODEL_DB', version = 1) {
    if (!window.indexedDB)
        return Promise.resolve(void 0);
    yield getDBVersion(dbName, version, tbName);
    // 创建数据库 名称、版本号
    let request = window.indexedDB.open(dbName, version);
    return new Promise(resolve => {
        request.onupgradeneeded = (ev) => {
            const db = ev.target.result;
            // 查询表是否存在
            if (!db.objectStoreNames.contains(tbName)) {
                // 创建表
                db.createObjectStore(tbName, {
                    // autoIncrement: true
                    keyPath: 'path'
                });
            }
            else {
                console.log(db);
            }
        };
        request.onsuccess = (ev) => {
            const db = ev.target.result;
            resolve(db);
        };
        request.onerror = ev => {
            console.log('数据库打开失败', ev);
            resolve(void 0);
        };
    });
});
// 获取数据
const getDataByKey = (db, objectStoreName, key) => {
    if (!db || !objectStoreName || !key)
        return Promise.resolve(null);
    // 打开对象存储空间
    const transaction = db.transaction([objectStoreName], 'readonly');
    const store = transaction.objectStore(objectStoreName);
    // 根据指定的键值查询数据
    const request = store.get(key);
    return new Promise((resolve, reject) => {
        // 获取索引数据
        request.onsuccess = (event) => {
            const target = event.target;
            const list = target.result;
            resolve(list); // 输出结果
        };
        request.onerror = (event) => {
            reject(event);
        };
    });
};
// 获取所有数据
const getAllData = (db, objectStoreName) => {
    const db_tb = db.transaction(objectStoreName, 'readonly').objectStore(objectStoreName);
    const request = db_tb.getAll();
    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            const target = event.target;
            const list = target.result;
            resolve(list); // 输出结果
        };
        request.onerror = (event) => {
            reject(event);
        };
    });
};

const KEYS = {
    TEXT: 'TEXT', // 文字
    JSQ: 'JSQ', // 集水器
    LDB: 'LDB', // 冷冻泵
    LQB: 'LQB', // 冷却泵
    XBC: 'XBC', // 蓄冰槽
    LXJ: 'LXJ', // 离心机
    LGJ: 'LGJ', // 螺杆机
    LGJ_2: 'LGJ_2', // 双头螺杆机
    LGJ_3: 'LGJ_3', // 三机头螺杆机
    LGJ_4: 'LGJ_4', // 四机头螺杆机
    LQT: 'LQT', // 冷却塔
    GL: 'GL', // 锅炉
    BSHRQ: 'BSHRQ', // 板式换热器
    BSHLQ: 'BSHLQ', // 板式换热器-制冷
    FLRB: 'FLRB', // 风冷热泵
    FJY_X: 'FJY_X', // 风机-右
    FJZ_X: 'FJZ_X', // 风机-左
    FJY: 'FJY', // 风机-右
    FJZ: 'FJZ', // 风机-左
    FM: 'FM', // 阀门
    XFM: 'XFM' // 阀门
};
var DEFAULTCONFIG = {
    // 本地缓存
    indexdb: {
        dbName: 'THREE__MODEL__DB',
        tbName: 'TB',
        version: 1
    },
    // 网格
    mesh: {
        // 接受阴影网格名称-（需要接受阴影）
        receiveShadowName: [
            '楼板',
            '地面',
            '底座',
            '底板',
            '基础',
            '基础底座',
            '冷却塔基础',
            '草地',
            'ground',
            'Ground'
        ],
        // 动画材质网格名称
        animatehName: [
            '动画',
            '螺杆A',
            '螺杆B',
            '螺杆A001',
            '螺杆B001',
            '螺杆A002',
            '螺杆B002',
            '叶轮A',
            '叶轮B',
            '叶轮C',
            '阀门'
        ],
        // 透明网格名称
        transparentName: ['透明', '透明外壳']
    },
    // 模型类型
    keys: KEYS,
    // 右键点击返回时间差
    rightClickBackDiffTime: 300,
    meshKey: {
        body: '__BODY_',
        color: '__COLOR_',
        warning: '__WARNING_',
        local: '__LOCAL_',
        disabled: '__DISABLED_',
        pipe: '__PIPE__'
    },
    // 状态偏差值
    statusOffset: {
        TEXT: {
            [KEYS.JSQ]: {
                position: { x: -20, y: 10, z: 0 },
                rotation: { x: 0, y: 270, z: 0 }
            },
            [KEYS.LDB]: {
                position: { x: -60, y: 0, z: 0 }
            },
            [KEYS.LQB]: {
                position: { x: 0, y: 0, z: 60 },
                rotation: { x: 0, y: 270, z: 0 }
            },
            [KEYS.LXJ]: {
                position: { x: 0, y: 16, z: 50 },
                rotation: { x: -20, y: 0, z: 0 }
            },
            [KEYS.LGJ]: {
                position: { x: 0, y: 16, z: 50 },
                rotation: { x: -20, y: 0, z: 0 }
            },
            [KEYS.LQT]: {
                position: { x: -60, y: 0, z: 0 }
            },
            [KEYS.BSHLQ]: {
                position: { x: 0, y: 16, z: 40 }
            }
        },
        WARNING: {
            [KEYS.JSQ]: {
                position: { x: 0, y: 62, z: 0 }
            },
            [KEYS.LDB]: {
                position: { x: -4, y: 45, z: 0 }
            },
            [KEYS.LQB]: {
                position: { x: 0, y: 45, z: 4 },
                rotation: { x: 0, y: 270, z: 0 }
            },
            [KEYS.LXJ]: {
                position: { x: 0, y: 78, z: 0 }
            },
            [KEYS.LGJ]: {
                position: { x: 0, y: 78, z: 0 }
            },
            [KEYS.LQT]: {
                position: { x: 0, y: 85, z: 0 }
            },
            [KEYS.BSHLQ]: {
                position: { x: 0, y: 88, z: 0 }
            }
        },
        STATUS: {
            [KEYS.LDB]: {
                position: { x: 9, y: 47, z: 0 }
            },
            [KEYS.LQB]: {
                position: { x: 0, y: 47, z: -9 },
                rotation: { x: 0, y: 270, z: 0 }
            },
            [KEYS.LXJ]: {
                position: { x: 27, y: 67, z: 42 }
            },
            [KEYS.LGJ]: {
                position: { x: -47, y: 67, z: 42 }
            },
            [KEYS.LQT]: {
                position: { x: -35, y: 69, z: 26 }
            }
        },
        DISABLED: {
            [KEYS.LDB]: {
                position: { x: 22, y: 47, z: 0 }
            },
            [KEYS.LQB]: {
                position: { x: 0, y: 47, z: -22 },
                rotation: { x: 0, y: 270, z: 0 }
            },
            [KEYS.LXJ]: {
                position: { x: 40, y: 67, z: 42 }
            },
            [KEYS.LGJ]: {
                position: { x: -34, y: 67, z: 42 }
            },
            [KEYS.LQT]: {
                position: { x: -22, y: 69, z: 26 }
            }
        }
    }
};

// 获取位置、大小、缩放参数
const get_P_S_R_param = (model, item, s = 1) => {
    // 模型本身
    const _position_ = model.position, _rotation_ = model.rotation, _scale_ = model.scale;
    // 设备配置
    const position = item.position || { x: 0, y: 0, z: 0 }, rotation = item.rotation || { x: 0, y: 0, z: 0 }, scale = item.scale || { x: 1, y: 1, z: 1 };
    // 判断配置角度倍数系数（小于 2 相当于使用的 180 度的倍数）
    const PInsx = Math.abs(rotation.x) < 2 ? 1 : 180;
    const PInsy = Math.abs(rotation.y) < 2 ? 1 : 180;
    const PInsz = Math.abs(rotation.z) < 2 ? 1 : 180;
    return {
        position: [_position_.x + position.x, _position_.y + position.y, _position_.z + position.z],
        rotation: [
            _rotation_.x + (Math.PI / PInsx) * rotation.x,
            _rotation_.y + (Math.PI / PInsy) * rotation.y,
            _rotation_.z + (Math.PI / PInsz) * rotation.z
        ],
        scale: [_scale_.x * s * scale.x, _scale_.y * s * scale.y, _scale_.z * s * scale.z]
    };
};
// 克隆材质
const cloneMaterial = (el) => {
    if (el.material instanceof Array) {
        el.material = el.material.map((mat) => mat.clone());
    }
    else {
        el.material = el.material.clone();
    }
};
// 深克隆 // 防止数据感染
const modelDeepClone = (obj) => {
    let model = obj.clone();
    if (obj.isMesh || obj.isSprite) {
        cloneMaterial(obj);
    }
    model.traverse((el) => {
        if (el.isMesh) {
            cloneMaterial(el);
        }
    });
    return model;
};
// 材质替换
const replaceMaterial = (child, color = 0x676565, meshNames, envMap) => {
    const { type, name } = child;
    // 灯光
    if (type.indexOf('Light') > -1) ;
    if (DEFAULTCONFIG.mesh.receiveShadowName.some(it => name.indexOf(it) > -1)) {
        // 接收阴影
        child.traverse((el) => {
            if (el.isMesh) {
                el.receiveShadow = true;
            }
        });
    }
    else if (meshNames.some(it => name.indexOf(it) > -1)) {
        setMaterialColor(child, color);
    }
    else if (child.isMesh) {
        envMap && (child.material.envMap = envMap);
        child.castShadow = true;
        child.receiveShadow = true;
    }
};
// 获取颜色数组
const getColorArr = (color) => {
    let arr = [];
    if (Array.isArray(color)) {
        arr = color;
    }
    else if (color != void 0) {
        arr = [color];
    }
    return arr;
};
// 设置材质颜色
const setMaterialColor = (e, color) => {
    e.traverse((el) => {
        if (el.isMesh) {
            el.castShadow = true;
            el.receiveShadow = true;
            if (Array.isArray(el.material)) {
                el.material.forEach((mt) => {
                    mt.color.set(color);
                });
            }
            else {
                el.material.color.set(color);
            }
        }
    });
};
// 相机入场动画
const cameraInSceneAnimate = (camera, to, at = new THREE.Vector3()) => {
    camera.lookAt(at);
    // @ts-ignore
    camera._lookAt_ = at;
    return new Promise(resolve => {
        new TWEEN.Tween(camera.position)
            .to(to, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .start()
            .onUpdate(() => {
            // 设置相机对焦位置
            camera.lookAt(at);
            // @ts-ignore
            camera._lookAt_ = at;
        })
            .onComplete(() => {
            resolve(camera);
        });
    });
};
// 相机聚焦转场
const cameraLookatAnimate = (camera, to, target) => {
    return new Promise(resolve => {
        new TWEEN.Tween(target)
            .to(to, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .start()
            .onUpdate(pos => {
            // 设置相机对焦位置
            camera.lookAt(pos);
            // @ts-ignore
            camera._lookAt_ = pos;
        })
            .onComplete(() => {
            resolve(camera);
        });
    });
};
// 相机于控制联动动画
const cameraLinkageControlsAnimate = (controls, camera, to, target) => {
    return new Promise(resolve => {
        new TWEEN.Tween(camera.position)
            .to(to, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .start()
            .onUpdate(() => {
            // 设置相机对焦位置
            const at = controls.target;
            camera.lookAt(at);
            // @ts-ignore
            camera._lookAt_ = at;
        });
        new TWEEN.Tween(controls.target)
            .to(target, 1000)
            .easing(TWEEN.Easing.Quadratic.In)
            .start()
            .onComplete(() => {
            resolve(camera);
        });
    });
};
// 创建精灵动画
const createSpriteAnimate = (model, POS, range = 1, duration = 10) => {
    // 创建动画
    // 创建对象的关键帧数据
    let times = [0, duration / 2, duration];
    let values = [
        ...POS, // 0
        POS[0],
        POS[1] + range,
        POS[2], // 5
        ...POS // 10
    ];
    let posTrack = new THREE.KeyframeTrack('sprite.position', times, values);
    let clip = new THREE.AnimationClip('sprite_up_down', duration, [posTrack]);
    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(clip);
    // 暂停
    // action.paused = true
    // 动画速度
    action.timeScale = 5;
    // 播放
    action.play();
    // 记录数据
    model.__action__ = action;
    model.__mixer__ = mixer;
    return model;
};
// 获取 3 维平面位置
const getPlanePosition = (dom, object, camera) => {
    let halfw = dom.clientWidth / 2;
    let halfh = dom.clientHeight / 2;
    let position = object.position.clone();
    const scale = object.scale;
    position.y += scale.x / 2;
    // 平面坐标
    let vector = position.project(camera);
    // 二维坐标 (没有加偏移量因为 css 父级又相对定位)
    let pos = {
        left: vector.x * halfw + halfw,
        top: -vector.y * halfh + halfh
    };
    return pos;
};
// 查找模型对象中包含指定属性的集合
const findObjectsByHasProperty = (children, values, property = 'name') => {
    let list = [];
    if (!children || !children.length)
        return [];
    function find(data) {
        data.forEach(el => {
            const name = el[property];
            if (typeof name == 'string' && values.some(t => name.indexOf(t) > -1)) {
                list.push(el);
            }
            if (el.children) {
                find(el.children);
            }
        });
    }
    find(children);
    return list;
};
// 获取状态偏差值
const STATUS_OFFSET = DEFAULTCONFIG.statusOffset;
const getStatusOffset = (key, item, offset = {}) => {
    const type = item.type;
    // @ts-ignore
    const defOffset = STATUS_OFFSET[key] || {};
    const obj = offset[type] || defOffset[type] || {};
    // 坐标
    let position = deepMerge({ x: 0, y: 0, z: 0 }, obj.position || {});
    // 角度
    let rotation = deepMerge({ x: 0, y: 0, z: 0 }, obj.rotation || {});
    (rotation.x = (Math.PI / 180) * rotation.x),
        (rotation.y = (Math.PI / 180) * rotation.y),
        (rotation.z = (Math.PI / 180) * rotation.z);
    return {
        position,
        rotation
    };
};
// 创建文字
const createText = (item, fontParser, color = 0xffffff, offset) => {
    const obj = getStatusOffset('TEXT', item, offset);
    let font = item.font || {};
    // 文字
    let textGeo = new TextGeometry(item.name || '', {
        font: fontParser,
        size: font.size || 10,
        depth: 0,
        curveSegments: 12, // 曲线分段
        bevelThickness: 1, // 斜面厚度
        bevelSize: 0.1, // 斜角大小
        bevelEnabled: true // 斜角
    });
    const rot = obj.rotation;
    textGeo.rotateX(rot.x);
    textGeo.rotateY(rot.y);
    textGeo.rotateZ(rot.z);
    const pos = obj.position;
    // 计算边界
    textGeo.computeBoundingBox();
    // 计算垂直算法
    textGeo.computeVertexNormals();
    // @ts-ignore
    let offsetX = 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    // @ts-ignore
    let offsetZ = 0.5 * (textGeo.boundingBox.max.z - textGeo.boundingBox.min.z);
    let material = new THREE.MeshPhongMaterial({
        color: font.color != void 0 ? font.color : color,
        flatShading: !true
    });
    let mesh = new THREE.Mesh(textGeo, material);
    mesh.castShadow = true;
    mesh.position.set((pos.x || 0) - offsetX, pos.y || 0, (pos.z || 0) - offsetZ);
    mesh.name = 'text';
    // @ts-ignore
    mesh._isText_ = true;
    return mesh;
};
// 创建警告标识 key、数据、模型、光源半径、缩放
const createWarning = (key, item, model, offset, radius = 100, s = 1) => {
    if (!model)
        return;
    const obj = getStatusOffset('WARNING', item, offset);
    let group = new THREE.Group();
    // 深克隆
    let warningSigns = modelDeepClone(model);
    warningSigns.scale.set(s, s, s);
    // 位置
    const pos = obj.position;
    warningSigns.position.set(pos.x, pos.y, pos.z);
    // 角度
    const rot = obj.rotation;
    warningSigns.rotation.set(rot.x, rot.y, rot.z);
    group.add(warningSigns);
    // 创建光源
    // 点光源 (颜色、强度、距离、衰减) 衰减！！！不要默认值
    let light = new THREE.PointLight(0xc20c00, 8, radius, 0);
    // const sphere = new THREE.SphereGeometry( 1, 16, 8 )
    // light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) )
    light.name = '灯光';
    light.position.y = pos.y + 30;
    group.add(light);
    group.name = key;
    // 警告标识动画
    let mixer = new THREE.AnimationMixer(group);
    // 创建颜色关键帧对象
    // 0 时刻对应颜色 1，0，0	 .25时刻对应颜色 1，1，1 .75...
    let colorKF = new THREE.KeyframeTrack('红色.material.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0]);
    let lightKF = new THREE.KeyframeTrack('灯光.color', [0, 0.25, 0.75], [1, 0, 0, 1, 1, 0, 1, 0, 0]);
    // 创建名为Sphere对象的关键帧数据	从0~20时间段，尺寸scale缩放3倍
    let scaleTrack = new THREE.KeyframeTrack('警告标识.scale', [0, 0.5, 1], [1, 1, 1, 1.2, 1.2, 2, 1, 1, 1]);
    // 多个帧动画作为元素创建一个剪辑 clip 对象，命名‘warning_’，持续时间1
    let clip = new THREE.AnimationClip(`warning_`, 1, [colorKF, lightKF, scaleTrack]);
    let action = mixer.clipAction(clip);
    // 暂停
    action.paused = true;
    // 播放
    action.play();
    // 隐藏
    group.visible = false;
    group._isWarning_ = true;
    return {
        group,
        action,
        mixer
    };
};
// 创建状态标识
const createStatusMark = (item, model, offset, isDisabled) => {
    if (!model)
        return;
    const obj = getStatusOffset(isDisabled ? 'DISABLED' : 'STATUS', item, offset);
    // 深克隆
    let status = modelDeepClone(model);
    // 位置
    const pos = obj.position;
    status.position.set(pos.x, pos.y, pos.z);
    // 角度
    const rot = obj.rotation;
    status.rotation.set(rot.x, rot.y, rot.z);
    status.visible = false;
    status._isStatus_ = true;
    return status;
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
 *			const obj1 = {
 *					a: 1,
 *					b: ["e", "f", "g"],
 *					c: { h: { i: 2 } },
 *			};
 *			obj1.b.push(obj1.c);
 *			obj1.c.j = obj1.b;
 *
 *			const obj2 = deepClone(obj1);
 *			obj2.b.push("h");
 *			console.log(obj1, obj2);
 *			console.log(obj2.c === obj1.c);
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

// 随机数
const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var index$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getTextturesUrl: getTextturesUrl,
    numConverter: numConverter,
    getUrl: getUrl,
    deleteDB: deleteDB,
    getDBVersion: getDBVersion,
    createDB: createDB,
    getDataByKey: getDataByKey,
    getAllData: getAllData,
    get_P_S_R_param: get_P_S_R_param,
    modelDeepClone: modelDeepClone,
    replaceMaterial: replaceMaterial,
    getColorArr: getColorArr,
    setMaterialColor: setMaterialColor,
    cameraInSceneAnimate: cameraInSceneAnimate,
    cameraLookatAnimate: cameraLookatAnimate,
    cameraLinkageControlsAnimate: cameraLinkageControlsAnimate,
    createSpriteAnimate: createSpriteAnimate,
    getPlanePosition: getPlanePosition,
    findObjectsByHasProperty: findObjectsByHasProperty,
    getStatusOffset: getStatusOffset,
    createText: createText,
    createWarning: createWarning,
    createStatusMark: createStatusMark,
    isType: isType,
    isObject: isObject,
    isDOM: isDOM,
    deepClone: deepClone,
    deepMerge: deepMerge,
    checkUrl: checkUrl,
    random: random
});

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
        //	巡航偏差
        offset: 10,
        // 系数
        factor: 1,
        // 自动巡航(可从动画函数执行机器人巡航)
        auto: false,
        // 帧动画回调
        animateBack: void 0,
        // 一直显示路线（默认巡航中展示路线）
        alway: false
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

// 转换数据
const useConvertData = () => {
    // 转换地图数据
    const transformGeoJSON = (json) => {
        let features = json.features;
        for (let i = 0; i < features.length; i++) {
            const item = features[i];
            // 将 Polygon 处理跟 MultiPolygon 一样的数据结构
            if (item.geometry.type === 'Polygon') {
                item.geometry.coordinates = [item.geometry.coordinates];
            }
        }
        return json;
    };
    return {
        transformGeoJSON
    };
};

const useCountryLine = () => {
    // 创建国家平面边线
    const createCountryFlatLine = (data, materialOptions, lineType = 'LineLoop') => {
        let materialOpt = {
            color: 0x00ffff,
            linewidth: 1,
            depthTest: false
        };
        materialOpt = deepMerge(materialOpt, materialOptions);
        let material = new THREE.LineBasicMaterial(materialOpt);
        if (lineType === 'Line2') {
            material = new LineMaterial(materialOpt);
        }
        let features = data.features;
        let lineGroup = new THREE.Group();
        for (let i = 0; i < features.length; i++) {
            const element = features[i];
            const coordinates = element.geometry.coordinates;
            for (let j = 0; j < coordinates.length; j++) {
                const coords = coordinates[j];
                // 每一块的点数据
                const points = [];
                if (lineType === 'Line2') {
                    coords.forEach((polygon) => {
                        polygon.forEach(item => {
                            points.push(item[0], 0, -item[1]);
                        });
                    });
                }
                else {
                    coords.forEach((polygon) => {
                        polygon.forEach(item => {
                            points.push(new THREE.Vector3(item[0], item[1], 0));
                        });
                    });
                }
                // 根据每一块的点数据创建线条
                let line = createLine(points, material, lineType);
                // 将线条插入到组中
                lineGroup.add(line);
            }
        }
        // 返回所有线条
        return lineGroup;
    };
    // 获取所有点位
    const getPoints = (data, y = 0, isVector3) => {
        let features = data.features;
        const points = [];
        for (let i = 0; i < features.length; i++) {
            const element = features[i];
            const coordinates = element.geometry.coordinates;
            for (let j = 0; j < coordinates.length; j++) {
                coordinates[j].forEach((polygon) => {
                    polygon.forEach(item => {
                        if (isVector3) {
                            points.push(new THREE.Vector3(item[0], y, -item[1]));
                        }
                        else {
                            points.push(item[0], y, -item[1]);
                        }
                    });
                });
            }
        }
        return points;
    };
    // 根据点数据创建闭合的线条
    // 生成的线条类型 Line 线 | LineLoop 环线 | LineSegments 线段 | Line2
    const createLine = (points, material, lineType = 'LineLoop') => {
        let line;
        if (lineType === 'Line2') {
            const geometry = new LineGeometry();
            geometry.setPositions(points);
            line = new Line2(geometry, material);
            line.name = 'countryLine2';
            // 计算线段距离
            line.computeLineDistances();
        }
        else {
            const geometry = new THREE.BufferGeometry();
            geometry.setFromPoints(points);
            line = new THREE[lineType](geometry, material);
            line.name = 'countryLine';
        }
        return line;
    };
    return {
        createCountryFlatLine,
        getPoints
    };
};

// three 场景 cdd 3d 标签
const useCSS3D = () => {
    // 初始化 CSS3D 标签
    const initCSS3DRender = (options, container) => {
        const { width, height } = options;
        const CSS3DRender = new CSS3DRenderer();
        // 设置渲染器的尺寸
        CSS3DRender.setSize(width, height);
        // 容器 css 样式
        CSS3DRender.domElement.style.position = 'absolute';
        CSS3DRender.domElement.style.left = '0px';
        CSS3DRender.domElement.style.top = '0px';
        CSS3DRender.domElement.style.pointerEvents = 'none';
        container.appendChild(CSS3DRender.domElement);
        return CSS3DRender;
    };
    // 创建 3D 元素
    const createCSS3DDom = (options) => {
        const { name, className = '', onClick, position, sprite } = options;
        const dom = document.createElement('div');
        dom.innerHTML = name;
        dom.className = className;
        const label = sprite ? new CSS3DSprite(dom) : new CSS3DObject(dom);
        dom.style.pointerEvents = onClick ? 'auto' : 'none';
        dom.style.position = 'absolute';
        if (typeof onClick === 'function') {
            dom.addEventListener('click', onClick);
        }
        if (position) {
            label.position.set(...position);
        }
        return label;
    };
    return {
        initCSS3DRender,
        createCSS3DDom
    };
};

const { createCSS3DDom } = useCSS3D();
// 地图柱状图 map-bar
const useMapBar = (options = {}) => {
    // 默认参数
    let _options = deepMerge({
        // 高度
        height: 10,
        // 柱状大小
        size: 2,
        // 高度系数
        factor: 1,
        color1: 0xfffff,
        color2: 0xffffff
    }, options);
    const createBar = (opts = {}, options = {}) => {
        var _a;
        _options = deepMerge(_options, options);
        let { size, height, factor, color1, color2 } = _options;
        size *= factor;
        height *= factor;
        height = height * ((_a = opts.heightRatio) !== null && _a !== void 0 ? _a : factor);
        const [x, y, z] = opts.position || [0, 0, 0];
        const group = new THREE.Group();
        // 创建柱状图几何体
        const geo = new THREE.BoxGeometry(size, size, height);
        // 自定义着色器材料
        const mat = new THREE.ShaderMaterial({
            depthTest: false,
            // side: THREE.DoubleSide,
            transparent: true,
            vertexColors: false,
            uniforms: {
                uColor1: { value: new THREE.Color(color1) },
                uColor2: { value: new THREE.Color(color2) },
                uOpacity: { value: 0.6 }
            },
            vertexShader: `
				varying vec3 vColor;
				uniform vec3 uColor1;
				uniform vec3 uColor2;
				void main() {
					float percent = (position.z + 0.0) / 100.0; // 计算当前像素点在立方体高度上的百分比
					vColor = mix(uColor1.rgb, uColor2.rgb, percent);
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
            fragmentShader: `
				varying vec3 vColor;
				uniform float uOpacity;
				void main() {
					gl_FragColor = vec4(vColor, uOpacity);
				}
			`
        });
        // 创建柱状图网格
        const barMesh = new THREE.Mesh(geo, mat);
        group.add(barMesh);
        group.name = '柱状图';
        group.position.set(x, y, z + height / 2);
        group.renderOrder = 99;
        if (opts.label) {
            const { name = '', className = '', onClick } = opts.label;
            const label = createCSS3DDom({
                name,
                className,
                position: [0, 0, height / 2],
                onClick
            });
            label.rotateX(Math.PI * 0.5);
            group.add(label);
        }
        return group;
    };
    return {
        createBar
    };
};

// 边缘线(地图 边界) out-line
const useOutline = (options = {}) => {
    // 默认参数
    let _options = deepMerge({
        // 粒子大小
        size: 0.1,
        color: 0xf57170,
        // 动画范围
        range: 500,
        // 系数
        factor: 1,
        // 速度
        speed: 6
    }, options);
    const createOutline = (points, options = {}) => {
        _options = deepMerge(_options, options);
        const { size, factor, range, color } = _options;
        const positions = new Float32Array(points);
        const opacityGeometry = new THREE.BufferGeometry();
        // 设置顶点
        opacityGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // 设置索引
        const vertexIndexs = new Float32Array(Math.floor(positions.length / 3)).map((_, i) => i);
        opacityGeometry.setAttribute('aIndex', new THREE.BufferAttribute(vertexIndexs, 1));
        const mat = new THREE.ShaderMaterial({
            vertexShader: `
				attribute float aOpacity;
				uniform float uSize;

				attribute float aIndex;
				varying vec3 vp;
				varying float vertexIndex;

				void main(){
					gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
					gl_PointSize = uSize;

					vp = position;
					vertexIndex = aIndex;
				}
			`,
            fragmentShader: `
				varying float vertexIndex;
				uniform vec3 uColor;
				uniform float uIndex;
				uniform float uRange;

				float invert(float n){
					return 1.-n;
				}

				void main(){
					float uOpacity = 1.0;
					if(vertexIndex <= uIndex || vertexIndex >= (uRange + uIndex)){
							discard;
					}
					uOpacity = (vertexIndex - uIndex)/uRange;
					if ( uOpacity < 0.2) {
						discard;
					}
					vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
					vec2 cUv=2.*uv-1.;
					vec4 color=vec4(1./length(cUv));
					color*=uOpacity;
					color.rgb*=uColor;
					gl_FragColor=color;
				}
			`,
            transparent: true, // 设置透明
            depthTest: false,
            uniforms: {
                uSize: {
                    value: size * factor
                },
                uIndex: { value: 0 },
                uLength: { value: vertexIndexs.length },
                uRange: { value: range },
                uColor: {
                    value: new THREE.Color(color)
                }
            }
        });
        const opacityPoints = new THREE.Points(opacityGeometry, mat);
        opacityPoints.name = '轮廓';
        opacityPoints.scale.setScalar(factor);
        return opacityPoints;
    };
    const update = (mesh) => {
        const mat = mesh.material;
        const uLength = mat.uniforms.uLength.value;
        mat.uniforms.uIndex.value += _options.speed;
        if (mat.uniforms.uIndex.value >= uLength) {
            mat.uniforms.uIndex.value = 0;
        }
    };
    return {
        createOutline,
        update,
        outlineUpdate: update
    };
};

// 光柱
const useMarkLight = (options = {}) => {
    // 默认参数
    let _options = deepMerge({
        // 标记点的图片url
        pointTextureUrl: getTextturesUrl('point.png'),
        // 光圈的URL
        circleTextureUrl: getTextturesUrl('circle.png'),
        // 光柱的URL
        lightTextureUrl: getTextturesUrl('light.png'),
        // 系数
        factor: 1,
        color: 0x00ffff
    }, options);
    // 纹理加载器
    const textureLoader = new THREE.TextureLoader();
    // 创建底部光点
    const createBottomPoint = () => {
        // 标记点：几何体，材质，
        const geometry = new THREE.PlaneGeometry(3, 3);
        const material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(_options.pointTextureUrl),
            color: _options.color,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false //禁止写入深度缓冲区数据
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = 1;
        mesh.name = '底部光点';
        // 缩放
        const scale = 0.3 * _options.factor;
        mesh.scale.setScalar(scale);
        return mesh;
    };
    // 创建光圈
    const createLightCircle = () => {
        // 标记点：几何体，材质，
        const geometry = new THREE.PlaneGeometry(3, 3);
        const material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(_options.circleTextureUrl),
            color: _options.color,
            side: THREE.DoubleSide,
            opacity: 0,
            transparent: true,
            depthWrite: false //禁止写入深度缓冲区数据
        });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.renderOrder = 2;
        mesh.name = 'createLightHalo';
        // 缩放
        const scale = 0.5 * _options.factor;
        mesh.scale.setScalar(scale);
        // 动画延迟时间
        const delay = random(0, 2000);
        // 动画：透明度缩放动画
        // @ts-ignore
        mesh.tween1 = new TWEEN.Tween({ scale: scale, opacity: 0 })
            .to({ scale: scale * 1.5, opacity: 1 }, 1000)
            .delay(delay)
            .onUpdate(params => {
            let { scale, opacity } = params;
            mesh.scale.setScalar(scale);
            mesh.material.opacity = opacity;
        });
        // @ts-ignore
        mesh.tween2 = new TWEEN.Tween({ scale: scale * 1.5, opacity: 1 })
            .to({ scale: scale * 2, opacity: 0 }, 1000)
            .onUpdate(params => {
            let { scale, opacity } = params;
            mesh.scale.setScalar(scale);
            mesh.material.opacity = opacity;
        });
        // 第一段动画完成后接第二段
        // @ts-ignore
        mesh.tween1.chain(mesh.tween2);
        // 第二段动画完成后接第一段
        // @ts-ignore
        mesh.tween2.chain(mesh.tween1);
        // @ts-ignore
        mesh.tween1.start();
        return mesh;
    };
    // 创建光柱
    const createMarkLight = (position = [0, 0, 0], height = 10, options = {}) => {
        _options = deepMerge(_options, options);
        const group = new THREE.Group();
        // 柱体的geo,6.19=柱体图片高度/宽度的倍数
        const geometry = new THREE.PlaneGeometry(height / 6.219, height);
        // 柱体旋转-90度，垂直于Z轴
        geometry.rotateX(-Math.PI / 2);
        // 柱体的z轴移动高度一半对齐中心点
        geometry.translate(0, 0, height / 2);
        // 柱子材质
        const material = new THREE.MeshBasicMaterial({
            map: textureLoader.load(_options.lightTextureUrl),
            color: _options.color,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });
        // 光柱01
        let light01 = new THREE.Mesh(geometry, material);
        light01.rotateX(Math.PI);
        light01.position.z = height;
        // 渲染顺序
        light01.renderOrder = 3;
        light01.name = '光柱 01';
        // 光柱02：复制光柱01
        let light02 = light01.clone();
        light02.name = '光柱 02';
        // 光柱02，旋转90°，跟 光柱01交叉
        light02.rotateZ(Math.PI / 2);
        // 底部光点
        const bottomPoint = createBottomPoint();
        // 光圈
        const circleLight = createLightCircle();
        // 将光柱和标点添加到组里
        group.add(light01, light02, bottomPoint, circleLight);
        const [x, y, z] = position;
        group.position.set(x, y, z);
        group.rotateX(Math.PI * 0.5);
        group.name = '光柱标记';
        return group;
    };
    return {
        createMarkLight
    };
};

// 电子围栏 fence
const useFence = () => {
    const repeat = [1, 0.8];
    const offsetY = 0.2;
    // 贴图
    const texture = new THREE.TextureLoader().load(getTextturesUrl('fenceMap0.png'), tx => {
        tx.wrapT = THREE.RepeatWrapping;
        tx.repeat.x = repeat[0];
        tx.repeat.y = repeat[1];
        tx.offset.y = offsetY;
    });
    const texture2 = new THREE.TextureLoader().load(getTextturesUrl('fenceMap1.png'), tx => {
        tx.wrapT = THREE.RepeatWrapping;
        tx.repeat.x = repeat[0];
        tx.repeat.y = repeat[1];
        tx.offset.x = offsetY;
    });
    const texture3 = new THREE.TextureLoader().load(getTextturesUrl('fenceMap2.png'), tx => {
        tx.wrapS = THREE.RepeatWrapping;
        tx.wrapT = THREE.RepeatWrapping;
    });
    // 创建平面
    const createPlane = (arr, indexArr, color) => {
        // 获取定点坐标组成一维数组
        const data = [];
        for (let i = 0; i < indexArr.length; i++) {
            const index = indexArr[i];
            data.push(...arr[index]);
        }
        const geometry = new THREE.BufferGeometry();
        // 设置几何图形顶点位置 3 个一组
        const vertices = new Float32Array(data);
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const count = indexArr.length;
        const normalAttribute = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
        geometry.setAttribute('normal', normalAttribute);
        for (let i = 0; i < count; i++) {
            normalAttribute.setXYZ(i, 0, 0, 0);
        }
        const uvs = [1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1];
        const uvsAttribute = new THREE.BufferAttribute(new Float32Array(uvs), 2);
        geometry.setAttribute('uv', uvsAttribute);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            map: texture,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const material2 = new THREE.MeshPhongMaterial({
            color: color,
            map: texture2,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        var material3 = new THREE.MeshPhongMaterial({
            color: color,
            map: texture3,
            opacity: 0.5,
            transparent: true,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        const group = new THREE.Group();
        const mesh2 = new THREE.Mesh(geometry, material2);
        const mesh3 = new THREE.Mesh(geometry, material3);
        group.add(mesh, mesh2, mesh3);
        // group.add(mesh2, mesh3)
        return group;
    };
    const createFence = (model, color = 0xa7ff83) => {
        const group = new THREE.Group();
        var boxHelper = new THREE.BoxHelper(model, color);
        boxHelper.update();
        const pos = boxHelper.geometry.getAttribute('position').array;
        const arr = [];
        for (let i = 0; i < pos.length; i += 3) {
            const x = pos[i];
            const y = pos[i + 1];
            const z = pos[i + 2];
            arr.push([x, y, z]);
        }
        // 围栏
        const m1 = createPlane(arr, [0, 1, 2, 2, 3, 0], color);
        const m2 = createPlane(arr, [4, 5, 6, 6, 7, 4], color);
        const m3 = createPlane(arr, [4, 0, 3, 3, 7, 4], color);
        const m4 = createPlane(arr, [1, 5, 6, 6, 2, 1], color);
        group.add(m1, m2, m3, m4);
        return group;
    };
    const fenceAnimate = (factor = 1) => {
        const steep = 0.008 * factor;
        if (texture) {
            let y = texture.offset.y - steep;
            if (y < 0)
                y = offsetY;
            texture.offset.y = y;
        }
        if (texture2) {
            let y = texture2.offset.y - steep;
            if (y < 0)
                y = offsetY;
            texture2.offset.y = y;
        }
    };
    return {
        createFence,
        fenceAnimate
    };
};

const useCorrugatedPlate = (options = {}) => {
    // 默认参数
    let _options = deepMerge({
        // 范围
        range: 100,
        // 间隔
        interval: 0.8,
        // 单个平面大小
        size: 0.2,
        // 颜色
        color: 0x00b8a9,
        // 浅色
        light: 0x0d7377,
        // 系数
        factor: 1
    }, options);
    const createGeometry = () => {
        let { range, interval, size, factor } = _options;
        range *= factor;
        interval *= factor;
        size *= factor;
        const geometrys = [];
        // 间隔，大小
        const len = Math.floor(range / interval);
        // 阵列多个立方体网格模型
        for (let i = -len; i <= len; i++) {
            for (let j = -len; j <= len; j++) {
                const geo = new THREE.PlaneGeometry(size, size);
                const x = i * interval;
                const z = j * interval;
                // 矩阵
                const matrix = new THREE.Matrix4();
                const pos = new THREE.Vector3(x, -size, z);
                // 四元数
                const quaternion = new THREE.Quaternion();
                // 欧拉对象
                const rotation = new THREE.Euler();
                // 缩放
                const scale = new THREE.Vector3(1, 1, 1);
                quaternion.setFromEuler(rotation);
                // 传入位置，角度，缩放 构建矩阵
                matrix.compose(pos, quaternion, scale);
                // 应用缩放矩阵到geometry的每个顶点
                geo.applyMatrix4(matrix);
                geometrys.push(geo);
            }
        }
        return geometrys;
    };
    const createCorrugatedPlate = (options = {}) => {
        _options = deepMerge(_options, options);
        let { range, color, light, factor } = _options;
        range *= factor;
        const geometrys = createGeometry();
        // 合并几何图形
        const geometry = BufferGeometryUtils.mergeGeometries(geometrys);
        const material = new THREE.ShaderMaterial({
            //	着色器代码 变量
            uniforms: {
                uColor: { value: new THREE.Color(light) },
                uTcolor: { value: new THREE.Color(color) },
                uRadius: { value: 1.25 },
                uLength: { value: range / 10 }, // 扫过区域(宽度)
                uRange: { value: range } // 扫过最大范围
            },
            // 顶点着色器
            vertexShader: `
				varying vec3 vp;
				void main(){
					vp = position;
					gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
            // 片元着色器
            fragmentShader: `
				varying vec3 vp;
				uniform vec3 uColor;
				uniform vec3 uTcolor;
				uniform float uRadius;
				uniform float uLength;
				float getLeng(float x, float y){
					return	sqrt((x-0.0)*(x-0.0)+(y-0.0)*(y-0.0));
				}
				void main(){
					float uOpacity = 0.8;
					vec3 vColor = uColor;
					float length = getLeng(vp.x,vp.z);
					if ( length <= uRadius && length > uRadius - uLength ) {
						float op = sin( (uRadius - length) / uLength ) ;
						uOpacity = op;
						if ( vp.y < 0.0 ) {
							vColor = uColor * op;
						} else {
							vColor = uTcolor;
						};
						vColor = uTcolor;
					}
					gl_FragColor = vec4(vColor,uOpacity);
				}
			`,
            transparent: true,
            // 深度写入
            depthWrite: false,
            // depthTest: false,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = '波纹板';
        return mesh;
    };
    const update = (mesh, dalte) => {
        const mat = mesh.material;
        // 扩散波半径
        const range = mat.uniforms.uRange.value;
        const length = mat.uniforms.uLength.value;
        mat.uniforms.uRadius.value += dalte * (range / 4);
        if (mat.uniforms.uRadius.value >= range + length) {
            mat.uniforms.uRadius.value = 0;
        }
    };
    return {
        createCorrugatedPlate,
        update,
        corrugatedPlateUpdate: update
    };
};

// 扩散波 diffusion
const useDiffusion = () => {
    let material;
    const createDiffusion = (width = 10, color = 0xff0ff0, circle = 5) => {
        const geometry = new THREE.PlaneGeometry(width, width, 1, 1);
        const vertexShader = [
            'varying vec2 vUv;',
            'void main() {',
            'vUv = uv;',
            // 最终顶点位置信息=投影矩阵*模型视图矩阵*每个顶点坐标
            'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
            '}'
        ].join('');
        const fragmentShader = [
            'varying vec2 vUv;',
            'uniform vec3 uColor;',
            'uniform float uOpacity;',
            'uniform float uSpeed;',
            'uniform float uSge;',
            'uniform float time;',
            'float PI = 3.14159265;',
            'float drawCircle(float index, float range) {',
            '	float opacity = 1.0;',
            '	if (index >= 1.0 - range) {',
            '		opacity = 1.0 - (index - (1.0 - range)) / range;',
            '	} else if(index <= range) {',
            '		opacity = index / range;',
            '	}',
            '	return opacity;',
            '}',
            'float distanceTo(vec2 src, vec2 dst) {',
            '	float dx = src.x - dst.x;',
            '	float dy = src.y - dst.y;',
            '	float dv = dx * dx + dy * dy;',
            '	return sqrt(dv);',
            '}',
            'void main() {',
            '	float iTime = -time * uSpeed;',
            '	float opacity = 0.0;',
            '	float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));',
            '	float size = 1.0 / uSge;',
            '	vec2 range = vec2(0.65, 0.75);',
            '	float index = mod(iTime + len, size);',
            // 中心圆
            '	vec2 cRadius = vec2(0.06, 0.12);',
            '	if (index < size && len <= 0.5) {',
            '		float i = sin(index / size * PI);',
            // 处理边缘锯齿
            '		if (i >= range.x && i <= range.y){',
            // 归一
            '			float t = (i - range.x) / (range.y - range.x);',
            // 边缘锯齿范围
            '			float r = 0.3;',
            '			opacity = drawCircle(t, r);',
            '		}',
            // 渐变
            '		opacity *=	1.0 - len / 0.5;',
            '	};',
            '	gl_FragColor = vec4(uColor, uOpacity * opacity);',
            '}'
        ].join('');
        material = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(color) },
                uOpacity: { value: 1 }, // 透明度
                uSpeed: { value: 0.1 }, // 速度
                uSge: { value: circle }, // 数量（圈数）
                uRadius: { value: width / 2 },
                time: { value: 0.0 }
            },
            transparent: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        return mesh;
    };
    const updateDiffusion = (factor = 1) => {
        if (!material)
            return;
        const time = performance.now() * 0.001 * factor;
        material.uniforms.time.value = time;
    };
    return {
        createDiffusion,
        updateDiffusion
    };
};

// 飞线
const useFlywire = (options = {}) => {
    // 默认参数
    let _options = deepMerge({
        // 深度
        depth: 0,
        // 高度(凸起高度)
        height: 4,
        // 飞线点位数
        divisions: 1000,
        color: 0xffffff,
        // 飞线-动态
        flyColor: 0xffc107,
        // 点位
        pointColor: 0xff0ff0,
        pointWidth: 2.5,
        // 流动飞线点位宽度
        flyPointWidth: 2.4,
        // 管道分段数 默认值为64。
        tubularSegments: 256,
        // 管道的半径，默认值为1。
        radius: 0.5,
        // 管道横截面的分段数目，默认值为8
        radialSegments: 8,
        // 管道的两端是否闭合，默认值为false。
        closed: false,
        // 流动长度
        length: 100,
        // 系数
        factor: 1,
        // 流动速度
        speed: 4
    }, options);
    // 流动材质
    let flyMaterial;
    // 做标点材质
    let pointMaterial;
    // 根据起点和终点获取曲线做标点
    const getCurvePoint = (coords) => {
        const [x1, z1] = coords[0];
        const [x2, z2] = coords[1];
        let { depth, height, factor, divisions } = _options;
        height = (depth + height) * factor;
        depth *= factor;
        // 坐标起点
        const v0 = new THREE.Vector3(x1, depth, -z1);
        // 控制点1坐标
        // 起点基础上，增加区间范围的 1/4
        const v1 = new THREE.Vector3(x1 + (x2 - x1) / 4, height, -(z1 + (z2 - z1) / 4));
        // 控制点2坐标
        // 起点基础上，增加区间范围的 3/4
        const v2 = new THREE.Vector3(x1 + ((x2 - x1) * 3) / 4, height, -(z1 + ((z2 - z1) * 3) / 4));
        // 终点
        const v3 = new THREE.Vector3(x2, depth, -z2);
        // 使用3次贝塞尔曲线
        const lineCurve = new THREE.CubicBezierCurve3(v0, v1, v2, v3);
        // 获取曲线上的点
        return lineCurve.getPoints(divisions);
    };
    // 创建飞线-动态
    const createFly = (points) => {
        const indexList = new Float32Array(points.map((_, index) => index));
        // 根据点位创建几何体
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        // 设置自定义索引标识
        geo.setAttribute('aIndex', new THREE.BufferAttribute(indexList, 1));
        return new THREE.Points(geo, flyMaterial);
    };
    // 创建坐标点
    const createCroodPoint = (crood) => {
        const [x, z] = crood;
        let { pointWidth, depth, factor } = _options;
        const width = pointWidth * factor;
        depth *= factor;
        // 创建平面
        const geo = new THREE.PlaneGeometry(width, width, 1, 1);
        const point = new THREE.Mesh(geo, pointMaterial);
        point.position.set(x, depth, -z);
        point.rotateX(-Math.PI * 0.5);
        return point;
    };
    // 创建材质
    const createFlywireTexture = (options = {}) => {
        _options = deepMerge(_options, options);
        flyMaterial = new THREE.ShaderMaterial({
            depthTest: false,
            uniforms: {
                // 线条颜色
                uColor: { value: new THREE.Color(_options.flyColor) },
                uIndex: { value: 0 },
                uTotal: { value: _options.divisions },
                // 流动宽度
                uWidth: { value: _options.flyPointWidth },
                // 流动长度
                uLength: { value: _options.length }
            },
            vertexShader: [
                'attribute float aIndex;',
                'uniform float uIndex;',
                'uniform float uWidth;',
                'uniform vec3 uColor;',
                'varying float vSize;',
                'uniform float uLength;',
                'void main(){',
                '		vec4 viewPosition = viewMatrix * modelMatrix * vec4(position,1);',
                '		gl_Position = projectionMatrix * viewPosition;',
                '		if(aIndex >= uIndex - uLength && aIndex < uIndex){',
                '			vSize = uWidth * ((aIndex - uIndex + uLength) / uLength);',
                '		}',
                '		gl_PointSize = vSize;',
                '}'
            ].join(''),
            side: THREE.DoubleSide,
            fragmentShader: [
                'varying float vSize;',
                'uniform vec3 uColor;',
                'void main(){',
                '		if(vSize<=0.0){',
                '			gl_FragColor = vec4(1,0,0,0);',
                '		}else{',
                '			gl_FragColor = vec4(uColor,1);',
                '		}',
                '}'
            ].join(''),
            transparent: true,
            vertexColors: false
        });
        pointMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(_options.pointColor) },
                uOpacity: { value: 1 }, // 透明度
                uSpeed: { value: 0.1 }, // 速度
                uSge: { value: 4 }, // 数量（圈数）
                uRadius: { value: (_options.pointWidth * _options.factor) / 2 },
                time: { value: 0.0 }
            },
            transparent: true,
            depthTest: false,
            vertexShader: [
                'varying vec2 vUv;',
                'void main() {',
                '	vUv = uv;',
                // 最终顶点位置信息=投影矩阵*模型视图矩阵*每个顶点坐标
                '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                '}'
            ].join(''),
            fragmentShader: [
                'varying vec2 vUv;',
                'uniform vec3 uColor;',
                'uniform float uOpacity;',
                'uniform float uSpeed;',
                'uniform float uSge;',
                'uniform float time;',
                'float PI = 3.14159265;',
                'float drawCircle(float index, float range) {',
                '	float opacity = 1.0;',
                '	if (index >= 1.0 - range) {',
                '		opacity = 1.0 - (index - (1.0 - range)) / range;',
                '	} else if(index <= range) {',
                '		opacity = index / range;',
                '	}',
                '	return opacity;',
                '}',
                'float distanceTo(vec2 src, vec2 dst) {',
                '	float dx = src.x - dst.x;',
                '	float dy = src.y - dst.y;',
                '	float dv = dx * dx + dy * dy;',
                '	return sqrt(dv);',
                '}',
                'void main() {',
                '	float iTime = -time * uSpeed;',
                '	float opacity = 0.0;',
                '	float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y));',
                '	float size = 1.0 / uSge;',
                '	vec2 range = vec2(0.65, 0.75);',
                '	float index = mod(iTime + len, size);',
                // 中心圆
                '	vec2 cRadius = vec2(0.06, 0.12);',
                '	if (index < size && len <= 0.5) {',
                '		float i = sin(index / size * PI);',
                // 处理边缘锯齿,
                '		if (i >= range.x && i <= range.y){',
                '			// 归一',
                '			float t = (i - range.x) / (range.y - range.x);',
                '			// 边缘锯齿范围',
                '			float r = 0.3;',
                '			opacity = drawCircle(t, r);',
                '		}',
                '		// 渐变',
                '		opacity *=	1.0 - len / 0.5;',
                '	};',
                '	gl_FragColor = vec4(uColor, uOpacity * opacity);',
                '}'
            ].join('\n'),
            side: THREE.DoubleSide
        });
    };
    const createFlywire = (coords) => {
        const group = new THREE.Group();
        // 坐标
        const start = createCroodPoint(coords[0]);
        const end = createCroodPoint(coords[1]);
        group.add(start, end);
        const points = getCurvePoint(coords);
        // 平滑样条线
        // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
        // 曲线类型：centripetal、chordal和catmullrom
        const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.5);
        // 管道
        const tubeGeo = new THREE.TubeGeometry(
        // 3D 路径
        curve, 
        // 管道分段数
        _options.tubularSegments, 
        // 半径
        _options.radius, 
        // 横截面分段
        _options.radialSegments, 
        // 管道闭合
        _options.closed);
        const tubMat = new THREE.ShaderMaterial({
            transparent: true,
            opacity: 1,
            depthTest: false,
            vertexColors: false,
            uniforms: {
                uColor: { value: new THREE.Color(_options.color) },
                uOpacity: { value: 0.6 }
            },
            vertexShader: [
                'varying vec3 vColor;',
                'uniform vec3 uColor;',
                'void main() {',
                '	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
                '}'
            ].join(''),
            fragmentShader: [
                'uniform vec3 uColor;',
                'uniform float uOpacity;',
                'void main() {',
                '	gl_FragColor = vec4(uColor, uOpacity);',
                '}'
            ].join('')
        });
        const tubMesh = new THREE.Mesh(tubeGeo, tubMat);
        tubMesh.renderOrder = 10;
        // 飞线
        const fly = createFly(points);
        group.add(tubMesh, fly);
        return group;
    };
    const update = () => {
        const mat = flyMaterial;
        const uTotal = mat.uniforms.uTotal.value;
        mat.uniforms.uIndex.value += _options.speed;
        if (mat.uniforms.uIndex.value >= uTotal) {
            mat.uniforms.uIndex.value = 0;
        }
        const time = performance.now() * 0.001;
        pointMaterial.uniforms.time.value = time;
    };
    createFlywireTexture();
    return {
        createFlywireTexture,
        createFlywire,
        update,
        flywireUpdate: update
    };
};

// 太阳光晕 lensflare
const useLensflare = (options = {}) => {
    // 默认参数
    let _options = deepMerge({
        // 主光晕
        mainTextureUrl: getTextturesUrl('lensflare0.png'),
        // 次光晕
        minorTextureUrl: getTextturesUrl('lensflare3.png')
    }, options);
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(_options.mainTextureUrl);
    const textureFlare3 = textureLoader.load(_options.minorTextureUrl);
    const addLensflare = (color, x, y, z) => {
        const light = new THREE.PointLight(0xffffff, 1, 2000, 0);
        light.color.set(color);
        light.position.set(x, y, z);
        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, light.color));
        lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        light.add(lensflare);
        return light;
    };
    return {
        addLensflare
    };
};

// 加载文件
const useFileLoader = () => {
    // 进度
    const progress = ref(0);
    // 加载
    const load = (url) => {
        const loader = new THREE.FileLoader();
        return new Promise((resolve, reject) => {
            loader.load(url, data => {
                let json = {};
                try {
                    json = JSON.parse(data);
                }
                catch (er) { }
                resolve(json);
            }, xhr => {
                let { loaded, total } = xhr;
                progress.value = Number(((loaded / total) * 100).toFixed(0));
            }, reject);
        });
    };
    return {
        load,
        progress
    };
};

// 上传 upload
const useUpload = (options) => {
    const _options = deepMerge({
        // 资源地址
        baseUrl: '',
        // draco 解压文件目录
        dracoPath: '/three/draco/gltf/',
        // basis 解压文件目录
        basisPath: '/three/basis/'
    }, options);
    const uploadModel = (files, onSuccess, onProgress) => {
        const { baseUrl, dracoPath, basisPath } = _options;
        const file = files[0];
        const filename = file.name;
        const type = filename.split('.').pop().toLowerCase();
        const reader = new FileReader();
        reader.addEventListener('progress', event => {
            const size = '(' + Math.floor(event.total / 1000) + ' KB)';
            const progress = Math.floor((event.loaded / event.total) * 100) + '%';
            if (onProgress)
                onProgress({ progress, filename, size });
        });
        reader.addEventListener('load', (event) => __awaiter(void 0, void 0, void 0, function* () {
            const contents = event.target.result;
            if (['glb', 'gltf'].includes(type)) {
                const loader = new GLTFLoader();
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath(`${baseUrl}${dracoPath}`);
                loader.setDRACOLoader(dracoLoader);
                const ktx2Loader = new KTX2Loader();
                ktx2Loader.setTranscoderPath(`${baseUrl}${basisPath}`);
                loader.setKTX2Loader(ktx2Loader);
                loader.setMeshoptDecoder(MeshoptDecoder);
                loader.parse(contents, '', result => {
                    var _a, _b, _c;
                    const children = result.scene.children;
                    let object = new THREE.Group();
                    if (children.length > 1) {
                        object.add(...children);
                    }
                    else {
                        object = children[children.length - 1];
                    }
                    object.name = ((_a = object.userData) === null || _a === void 0 ? void 0 : _a.name) || filename;
                    object.animations.push(...result.animations);
                    onSuccess(object);
                    (_b = loader.dracoLoader) === null || _b === void 0 ? void 0 : _b.dispose();
                    (_c = loader.ktx2Loader) === null || _c === void 0 ? void 0 : _c.dispose();
                });
            }
            else if (type == 'fbx') {
                const loader = new FBXLoader();
                const object = loader.parse(contents, '');
                onSuccess(object);
            }
        }));
        reader.readAsArrayBuffer(file);
    };
    return {
        uploadModel
    };
};

// 碰撞 collide
const useCollide = () => {
    // 检测射线
    const raycaster = new THREE.Raycaster();
    // 向量
    const up = new THREE.Vector3(0, 2, 0);
    // 检测碰撞（目标、坐标、检测的对象集合、是否检测子集）
    const checkCollide = (target, pos, objects, recursive = true, upVector = up) => {
        // 当前目标坐标,Y轴加一个固定向量，代表纵轴射线发射（检测碰撞的）位置
        const origin = pos.clone().add(upVector);
        // 获取目标朝向
        const direction = new THREE.Vector3();
        target.getWorldDirection(direction);
        direction.normalize();
        // 设置射线发射位置
        raycaster.ray.origin.copy(origin);
        // 设置射线发射方向
        raycaster.ray.direction.copy(direction);
        // 开始【前、后】检测：对于blender制作的模型，需要递归遍历所有child，否则无法实现射线碰撞检测{[childs], true}
        const intersects = raycaster.intersectObjects(objects, recursive);
        return intersects;
    };
    return {
        checkCollide
    };
};

const useCoord = () => {
    // 计算包围盒
    const getBoundingBox = (group) => {
        // 包围盒计算模型对象的大小和位置
        var box3 = new THREE.Box3();
        // 计算模型包围盒
        box3.expandByObject(group);
        var size = new THREE.Vector3();
        // 计算包围盒尺寸
        box3.getSize(size);
        var center = new THREE.Vector3();
        // 计算一个层级模型对应包围盒的几何体中心坐标
        box3.getCenter(center);
        return {
            box3,
            center,
            size
        };
    };
    return {
        getBoundingBox
    };
};

// 光线投射 平面坐标于 3D 坐标转换
const useRaycaster = () => {
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const style = {
        left: 0,
        top: 0
    };
    const update = (e, dom, scale = 1) => {
        // 获取元素偏移量
        const rect = dom.getBoundingClientRect() || { left: 0, top: 0 };
        // 渲染元素作为子组件可能有缩放处理，元素大小需要计算处理
        // 设置二维向量坐标 （-1， 1 范围）
        pointer.x = ((e.clientX - rect.left) / (dom.clientWidth * scale)) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / (dom.clientHeight * scale)) * 2 + 1;
        const halfw = dom.clientWidth / 2;
        const halfh = dom.clientHeight / 2;
        // 二维坐标 (没有加偏移量因为 css 父级又相对定位)
        style.left = pointer.x * halfw + halfw;
        style.top = -pointer.y * halfh + halfh;
    };
    return {
        raycaster,
        pointer,
        style,
        update
    };
};

const getOpts$1 = () => ({
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
    //	巡航偏差
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
    animateBack: void 0,
    // 一直显示路线（默认巡航中展示路线）
    alway: false
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
    let _options = getOpts$1();
    const createCruise = (options, renderer) => {
        // 默认参数
        _options = deepMerge(getOpts$1(), options);
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
                side: 'both' // left/right/both	左/右/两者
            }, false);
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
    const updateCruise = (options) => {
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

// three css 2d 标签
const useCSS2D = () => {
    // 初始化 CSS2D 标签
    const initCSS2DRender = (options, container) => {
        const { width, height } = options;
        const CSS2DRender = new CSS2DRenderer();
        // 设置渲染器的尺寸
        CSS2DRender.setSize(width, height);
        // 容器 css 样式
        CSS2DRender.domElement.style.position = 'absolute';
        CSS2DRender.domElement.style.left = '0px';
        CSS2DRender.domElement.style.top = '0px';
        CSS2DRender.domElement.style.pointerEvents = 'none';
        container.appendChild(CSS2DRender.domElement);
        return CSS2DRender;
    };
    // 创建 2D 元素
    const createCSS2DDom = (options) => {
        const { name, className = '', onClick, position } = options;
        const dom = document.createElement('div');
        dom.innerHTML = name;
        dom.className = className;
        const label = new CSS2DObject(dom);
        dom.style.pointerEvents = onClick ? 'auto' : 'none';
        dom.style.position = 'absolute';
        if (typeof onClick === 'function') {
            dom.addEventListener('click', e => onClick(e, label));
        }
        if (position) {
            label.position.set(...position);
        }
        return label;
    };
    return {
        initCSS2DRender,
        createCSS2DDom
    };
};

// 楼层 floor
const useFloor = (options = {}) => {
    const _options = deepMerge({
        mode: 'BA',
        margin: 50
    }, options);
    const floorAnimate = (list, index, getFllowMarkFn) => {
        var _a, _b, _c, _d, _e, _f;
        // 执行目标是否存在
        const isExist = index !== void 0 && index > -1;
        const { margin, mode } = _options;
        for (let i = 0; i < list.length; i++) {
            const el = list[i];
            // 换算间距
            const pos = el._position_;
            let k = i - (!isExist ? i : index);
            const cy = k * margin;
            // 原始坐标+偏移
            let ty = ((_a = pos.y) !== null && _a !== void 0 ? _a : 0) + cy;
            let tz = index == i ? ((_b = pos.z) !== null && _b !== void 0 ? _b : 0) + margin : (_c = pos.z) !== null && _c !== void 0 ? _c : 0;
            // 当前点击目标已经移动过，则收起
            const isMove = index === i &&
                ((mode === 'UD' && ty === el.position.y) || (mode === 'BA' && tz === el.position.z));
            if (isMove) {
                ty = (_d = pos.y) !== null && _d !== void 0 ? _d : 0;
                tz = (_e = pos.z) !== null && _e !== void 0 ? _e : 0;
            }
            // 判断模式
            // UD 上下
            // BA 前后
            // 移动目标为模型坐标则不执行动画
            if (mode === 'UD') {
                if (el.position.y === ty)
                    continue;
            }
            else if (mode === 'BA') {
                if (el.position.z === tz)
                    continue;
            }
            // 标记跟随模型
            if ((_f = el.data) === null || _f === void 0 ? void 0 : _f.mark) {
                const mark = el.data.mark;
                const items = getFllowMarkFn(mark);
                // 偏移
                let offset = index == i ? margin : 0;
                if (isMove) {
                    offset = 0;
                }
                fllowModelAnimate(mode, items, cy, offset);
            }
            new TWEEN.Tween(el.position)
                .to({
                y: mode === 'UD' ? ty : el.position.y,
                z: mode === 'BA' ? tz : el.position.z
            }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        }
    };
    // 跟随模型动画
    const fllowModelAnimate = (mode, items, cy, cz) => {
        if (items.length === 0)
            return;
        items.forEach(el => {
            var _a, _b, _c, _d;
            const pos = el._position_;
            const ty = mode == 'UD' ? ((_a = pos.y) !== null && _a !== void 0 ? _a : 0) + cy : (_b = pos.y) !== null && _b !== void 0 ? _b : 0;
            const tz = mode == 'BA' ? ((_c = pos.z) !== null && _c !== void 0 ? _c : 0) + cz : (_d = pos.z) !== null && _d !== void 0 ? _d : 0;
            new TWEEN.Tween(el.position)
                .to({
                y: ty,
                z: tz
            }, 500)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });
    };
    return {
        floorAnimate
    };
};

// 弹窗配置
const useDialog = (options = {}) => {
    const dialog = reactive(deepMerge({
        show: false,
        style: {
            left: '',
            top: ''
        },
        select: [],
        data: {},
        title: '',
        position: {
            top: 0,
            left: 0
        }
    }, options));
    const show = toRef(dialog.show);
    return {
        dialog,
        options: dialog,
        show
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

// 材质 material
const useMaterial = () => {
    // 改变透明
    const changeTransparent = (mode, opacity = 0.5) => {
        // 改变透明度
        const change = (mesh) => {
            mesh.material.transparent = true;
            mesh.material.opacity = opacity;
        };
        if (mode.isMesh) {
            change(mode);
        }
        else {
            mode.traverse((mode) => {
                if (mode.isMesh) {
                    change(mode);
                }
            });
        }
    };
    const getMaterialAttr = (mat) => {
        return {
            color: mat.color, // 颜色
            map: mat.map, // 贴图
            emissive: mat.emissive, // 发光
            emissiveIntensity: mat.emissiveIntensity,
            emissiveMap: mat.emissiveMap,
            bumpMap: mat.bumpMap, // 凹凸
            normalMap: mat.normalMap, // 法线
            displacementMap: mat.displacementMap, // 移动
            opacity: mat.opacity, // 透明度
            transparent: mat.transparent, // 透明
            side: mat.side // 材质渲染面
        };
    };
    // 材质优化 材质、是否反光、是否粗糙
    const materialOptimize = (mat, glisten, side) => {
        if (mat instanceof Array) {
            let material = mat.map(mt => {
                return materialOptimize(mt, glisten, side);
            });
            mat = material;
        }
        else {
            if (!glisten) {
                // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
                // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
                mat.metalness = 0.5;
                // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
                mat.roughness = 1;
            }
            else {
                // mat.side = THREE.DoubleSide
                mat.metalness = 0.5;
                mat.roughness = 0;
            }
            // child.material.emissiveMap = child.material.map
            mat = new THREE.MeshStandardMaterial(Object.assign(Object.assign({}, getMaterialAttr(mat)), { 
                // depthTest: false, // 深度写入（解决重叠）
                metalness: mat.metalness, roughness: mat.roughness, side: side ? THREE.DoubleSide : THREE.FrontSide // 材质渲染面
             }));
        }
        return mat;
    };
    // 材质替换	动画部分材质颜色
    const materialReplace = (group, opts, child, color = 0x127e12) => {
        const mesh = DEFAULTCONFIG.mesh;
        const animateMeshName = mesh.animatehName;
        const transparentMeshName = mesh.transparentName;
        const { type, name } = child;
        // 灯光
        if (type.indexOf('Light') > -1) {
            if (!child.shadow)
                return;
            let s = 800;
            child.castShadow = true;
            child.shadow.camera.right = s;
            child.shadow.camera.left = -s;
            child.shadow.camera.top = s;
            child.shadow.camera.bottom = -s;
            if (type === 'SpotLight') {
                let helper = new THREE.SpotLightHelper(child, child.color);
                group.add(helper);
            }
            return;
        }
        // 是否转换标准材质
        if (!opts.transformMaterial || !child.isMesh)
            return;
        if (opts.opacitySkin && transparentMeshName.find(it => name.indexOf(it) > -1)) {
            changeTransparent(child, opts.opacity);
        }
        if (mesh.receiveShadowName.find((it) => name.indexOf(it) > -1)) {
            // 接收阴影
            child.receiveShadow = true;
            const glisten = opts.groundReflection;
            child.material = materialOptimize(child.material, glisten, opts.side);
        }
        else if (animateMeshName.find((it) => name.indexOf(it) > -1)) {
            // 动画材质
            let material = new THREE.MeshStandardMaterial({
                color: color,
                // 材质像金属的程度. 非金属材料，如木材或石材，使用0.0，金属使用1.0，中间没有（通常）.
                // 默认 0.5. 0.0到1.0之间的值可用于生锈的金属外观
                metalness: 0.6,
                // 材料的粗糙程度. 0.0表示平滑的镜面反射，1.0表示完全漫反射. 默认 0.5
                roughness: 0.6
            });
            child.material = material;
        }
        else if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = materialOptimize(child.material, opts.glisten, opts.side);
        }
    };
    const saveFile = (blob, filename) => {
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link); // Firefox workaround, see #6594
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        link.remove();
    };
    const saveString = (text, filename) => {
        saveFile(new Blob([text], { type: 'text/plain' }), filename);
    };
    const saveArrayBuffer = (buffer, filename) => {
        saveFile(new Blob([buffer], { type: 'application/octet-stream' }), filename);
    };
    // 导出 glb、gltf 文件
    const exportGlb = (model, animations, name, isGlb = true) => {
        if (!model)
            return;
        const gltfExporter = new GLTFExporter();
        const options = {
            // trs: false,
            // onlyVisible: true,
            // truncateDrawRange: true,
            binary: isGlb,
            // maxTextureSize: 1024 || 4096 || Infinity, // To prevent NaN value,
            animations: animations // 动画
        };
        gltfExporter.parse(model, result => {
            if (result instanceof ArrayBuffer) {
                saveArrayBuffer(result, name + '.glb');
            }
            else {
                const output = JSON.stringify(result, null, 2);
                saveString(output, name + '.gltf');
            }
        }, error => {
            console.log('An error happened during parsing', error);
        }, options);
    };
    // 获取动画
    const getAnimations = (model) => {
        const animations = [];
        model.traverse((object) => {
            animations.push(...object.animations);
        });
        const optimizedAnimations = [];
        for (const animation of animations) {
            optimizedAnimations.push(animation.clone().optimize());
        }
        return optimizedAnimations;
    };
    // 设置金属材质
    const setMetalnessMaterial = (mat = { color: 0xffffff }, metalness, roughness) => {
        return new THREE.MeshStandardMaterial(Object.assign(Object.assign({}, getMaterialAttr(mat)), { metalness: metalness, roughness: roughness // 粗糙度
         }));
    };
    // 设置玻璃材质
    const setGlassMaterial = (mat = {
        color: 0xffffff
    }, { metalness = 0, roughness = 0, envMapIntensity = 0, transmission = 0, ior = 0 }) => {
        return new THREE.MeshPhysicalMaterial(Object.assign(Object.assign({}, getMaterialAttr(mat)), { metalness, //玻璃非金属	金属度设置0
            roughness, //玻璃表面光滑
            envMapIntensity, //环境贴图对Mesh表面影响程度
            transmission, //透射度(透光率)
            ior //折射率
         }));
    };
    // 盒子模型辅助
    const centerBoxHelper = (model, hex = 0xff0000) => {
        // 创建 BoxHelper
        var boxHelper = new THREE.BoxHelper(model, hex);
        //更新
        boxHelper.update();
        // 获取模型的包围盒
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        return {
            helper: boxHelper,
            center
        };
    };
    return {
        materialReplace,
        changeTransparent,
        exportGlb,
        getAnimations,
        setMetalnessMaterial,
        setGlassMaterial,
        centerBoxHelper
    };
};

// 移动动画 move-animate
const useMoveAnimate = () => {
    // 曲线
    let cruiseCurve;
    const _options = {
        // 动画索引
        index: 0,
        // 总长度
        length: 0,
        // 运行中
        runing: false,
        // 模型
        model: void 0,
        // 速度
        speed: 1,
        // 结束回调
        endCallback: void 0,
        // 运行中回调
        rungingCall: void 0
    };
    const createMove = (model, moveTo, rungingCall, endCallback) => {
        const pos = model.position;
        // 求正切值
        const angle = Math.atan2(-moveTo.z + pos.z, moveTo.x - pos.x);
        model.rotation.y = Math.PI * 0.5 + angle;
        // 长度
        const distance = pos.distanceTo(moveTo);
        let len = Math.floor(distance / _options.speed);
        if (len < 2)
            len = 2;
        const points = [pos, moveTo];
        cruiseCurve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0);
        cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(len), false, 'catmullrom', 0);
        _options.model = model;
        _options.index = 0;
        _options.length = len;
        _options.rungingCall = rungingCall;
        _options.endCallback = endCallback;
        _options.runing = true;
    };
    // 所有点位
    const getAllPoints = (len) => cruiseCurve === null || cruiseCurve === void 0 ? void 0 : cruiseCurve.getPoints(len);
    // 获取进度坐标
    const getProgressPosition = (index) => {
        let t = index / _options.length;
        if (t > 1)
            t = 1;
        else if (t < 0)
            t = 0;
        return cruiseCurve.getPointAt(t);
    };
    // 停止 后退
    const stop = (retreat = true) => {
        _options.runing = false;
        if (retreat) {
            const index = _options.index - 1;
            _options.model.position.copy(getProgressPosition(index));
        }
    };
    // 动画
    const moveAnimate = (factor = 1) => {
        if (!_options.runing)
            return;
        _options.index += factor;
        let t = _options.index / _options.length;
        if (t > 1)
            t = 1;
        const pos = cruiseCurve.getPointAt(t);
        _options.model.position.copy(pos);
        if (t >= 1) {
            _options.runing = false;
            if (typeof _options.endCallback === 'function')
                _options.endCallback(pos);
        }
        else {
            if (typeof _options.rungingCall === 'function')
                _options.rungingCall(pos, stop);
        }
    };
    return {
        createMove,
        moveAnimate
    };
};

const getOpts = () => ({
    // 运行中
    runing: false,
    // 分段
    segment: 2,
    // 闭合
    close: true,
    // 曲线张力
    tension: 0,
    // 视角偏差
    offset: 0,
    // 点位
    points: [],
    // 系数
    factor: 1,
    // 移动速度
    speed: 1,
    // 索引
    index: 0,
    // 帧动画回调
    animateBack: void 0
});
// 漫游 roam
const useRoam = () => {
    // 曲线
    let cruiseCurve;
    let _options = getOpts();
    const createRoam = (options = {}) => {
        if (cruiseCurve)
            return;
        // 默认参数
        _options = deepMerge(getOpts(), options);
        const { points, tension, close } = _options;
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            newPoints.push(new THREE.Vector3(p[0], p[1], p[2]));
        }
        // CatmullRomCurve3( 点位、曲线闭合、曲线类型、类型catmullrom时张力默认 0.5)
        // 曲线类型：centripetal、chordal和catmullrom
        cruiseCurve = new THREE.CatmullRomCurve3(newPoints, close, 'catmullrom', tension !== null && tension !== void 0 ? tension : 0);
        cruiseCurve = new THREE.CatmullRomCurve3(getAllPoints(), close, 'catmullrom', tension !== null && tension !== void 0 ? tension : 0);
    };
    const reset = (options) => {
        cruiseCurve = void 0;
        createRoam(options);
    };
    // 所有点位
    const getAllPoints = () => cruiseCurve === null || cruiseCurve === void 0 ? void 0 : cruiseCurve.getPoints(getCruiseLen());
    // 长度
    const getCruiseLen = () => { var _a; return ((_a = _options.segment) !== null && _a !== void 0 ? _a : 2) * 1000; };
    // 偏移坐标
    const getOffsetPoint = (offset, pos) => {
        return new THREE.Vector3(pos.x, pos.y + offset, pos.z);
    };
    // 更新参数
    const updateRoam = (options) => {
        // 默认参数
        _options = deepMerge(_options, options);
    };
    // 暂停
    const pause = () => {
        _options.runing = false;
    };
    // 播放
    const play = () => {
        _options.runing = true;
    };
    // 获取状态
    const getStatus = () => _options.runing;
    // 执行漫游
    const executeRoam = (camera, controls) => {
        if (!camera || !controls)
            return;
        if (!cruiseCurve)
            return;
        const { runing, offset, factor, speed, animateBack } = _options;
        if (!runing)
            return;
        _options.index += factor * speed;
        const looptime = getCruiseLen();
        const t = (_options.index % looptime) / looptime;
        const oft = 0.01;
        let ts = t + oft;
        if (ts > 1)
            ts = ts - 1;
        const pos = cruiseCurve.getPointAt(ts);
        const _pos = getOffsetPoint(offset, cruiseCurve.getPointAt(t));
        // 视角偏差
        const at = getOffsetPoint(offset, pos);
        controls.target = at;
        camera._lookAt_ = at;
        camera.lookAt(controls.target);
        if (typeof animateBack === 'function')
            animateBack(_pos, pos, cruiseCurve, t);
    };
    return {
        createRoam,
        updateRoam,
        executeRoam,
        pause,
        play,
        reset,
        getStatus
    };
};

// 开门 open-the-door
const useOpenTheDoor = () => {
    let _options = {
        // 属性名
        propertyName: 'name',
        // 值
        value: '',
        // 开门大小
        scale: 10,
        // 坐标轴
        axle: 'z',
        // 是否打开(未传入则根据当前状态自动转换)
        isOpen: void 0,
        // 左门匹配名称
        leftMatch: '左',
        rightMatch: '右',
        // 动画时长
        duration: 1 * 1000,
        // 旋转角度
        angle: Math.PI * 0.5,
        // 自动关闭
        autoClose: true,
        // 延迟(自动关闭)
        delay: 10 * 1000
    };
    // 双开横推门
    const dubleHorizontal = (scene, options) => {
        const { propertyName, value, scale, axle, isOpen, leftMatch, rightMatch, duration, autoClose, delay } = deepMerge(_options, options);
        // 查找双开门分组
        const dobj = scene.getObjectByProperty(propertyName, value);
        if (!dobj) {
            console.warn('未找到目标！');
            return Promise.reject();
        }
        // 左右门
        const left = dobj.children.find(el => el.name.indexOf(leftMatch) > -1);
        const right = dobj.children.find(el => el.name.indexOf(rightMatch) > -1);
        if (!left || !right) {
            console.warn('未找到双开门！');
            return Promise.reject();
        }
        if (autoClose) {
            // 清除定时器
            clearTimeout(dobj.__timer__);
        }
        const lpos = left.position;
        const rpos = right.position;
        // 当前状态无 则存储坐标
        if (dobj.__open__ == void 0) {
            left.__position__ = new THREE.Vector3().copy(lpos);
            right.__position__ = new THREE.Vector3().copy(rpos);
        }
        // 设置当前开门状态
        dobj.__open__ = isOpen !== void 0 ? isOpen : !dobj.__open__;
        return new Promise(resolve => {
            const rMove = right.__position__[axle] + (dobj.__open__ ? -scale : 0);
            // 坐标不变则直接返回
            if (rpos[axle] === rMove)
                return resolve(dobj);
            new TWEEN.Tween(lpos)
                .to({
                [axle]: left.__position__[axle] + (dobj.__open__ ? scale : 0)
            }, duration)
                .delay(0)
                .start();
            new TWEEN.Tween(rpos)
                .to({
                [axle]: rMove
            }, duration)
                .delay(0)
                .start()
                .onComplete(() => {
                resolve(dobj);
            });
            if (autoClose) {
                // 延迟 自动关闭
                if (dobj.__open__) {
                    dobj.__timer__ = setTimeout(() => {
                        dubleHorizontal(scene, options);
                    }, delay + duration);
                }
            }
        });
    };
    // 双旋转开门
    const dubleRotate = (scene, options) => {
        const { propertyName, value, angle, axle, leftMatch, rightMatch, isOpen, duration, autoClose, delay } = deepMerge(_options, options);
        // 查找双开门分组
        const dobj = scene.getObjectByProperty(propertyName, value);
        if (!dobj) {
            console.warn('未找到目标！');
            return Promise.reject();
        }
        // 左右门
        const left = dobj.children.find(el => el.name.indexOf(leftMatch) > -1);
        const right = dobj.children.find(el => el.name.indexOf(rightMatch) > -1);
        if (!left || !right) {
            console.warn('未找到双开门！');
            return Promise.reject();
        }
        if (autoClose) {
            // 清除定时器
            clearTimeout(dobj.__timer__);
        }
        const lrote = left.rotation;
        const rrote = right.rotation;
        if (dobj.__open__ == void 0) {
            left.__rotation__ = new THREE.Euler().copy(lrote);
            right.__rotation__ = new THREE.Euler().copy(rrote);
        }
        // 设置当前开门状态
        dobj.__open__ = isOpen !== void 0 ? isOpen : !dobj.__open__;
        return new Promise(resolve => {
            const rMove = right.__rotation__[axle] + (dobj.__open__ ? -angle : 0);
            // 坐标不变则直接返回
            if (rrote[axle] === rMove)
                return resolve(dobj);
            new TWEEN.Tween(left.rotation)
                .to({
                [axle]: left.__rotation__[axle] + (dobj.__open__ ? angle : 0)
            }, duration)
                .delay(0)
                .start();
            new TWEEN.Tween(right.rotation)
                .to({
                [axle]: rMove
            }, duration)
                .delay(0)
                .start();
            if (autoClose) {
                // 延迟 自动关闭
                if (dobj.__open__) {
                    dobj.__timer__ = setTimeout(() => {
                        dubleRotate(scene, options);
                    }, delay + duration);
                }
            }
        });
    };
    return {
        dubleHorizontal,
        dubleRotate
    };
};

// 事件 KeyboardState
const useKeyboardState = () => {
    // 修饰按键
    const MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];
    // 按键别名 对应值
    const ALIAS = {
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        space: 32,
        pageup: 33,
        pagedown: 34,
        tab: 9
    };
    const _keyCodes = {};
    const _modifiers = {};
    // 插入回调
    let _onKeydownCall;
    let _onKeyupCall;
    const _onKeyChange = (event, pressed) => {
        var keyCode = event.keyCode;
        _keyCodes[keyCode] = pressed;
        // 更新修饰状态
        _modifiers['shift'] = event.shiftKey;
        _modifiers['ctrl'] = event.ctrlKey;
        _modifiers['alt'] = event.altKey;
        _modifiers['meta'] = event.metaKey;
    };
    const _onKeyDown = (event) => {
        _onKeyChange(event, true);
        if (typeof _onKeydownCall === 'function')
            _onKeydownCall(event);
    };
    const _onKeyUp = (event) => {
        _onKeyChange(event, false);
        if (typeof _onKeyupCall === 'function')
            _onKeyupCall(event);
    };
    // 事件插入
    const insertEvent = (onKeydown, onKeyup) => {
        _onKeydownCall = onKeydown;
        _onKeyupCall = onKeyup;
    };
    // 绑定事件
    document.addEventListener('keydown', _onKeyDown, false);
    document.addEventListener('keyup', _onKeyUp, false);
    // 检测按下的按键(可组合键 alt+W)
    const detection = (keyDesc) => {
        var keys = keyDesc.split('+');
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var pressed;
            // 组合按键
            if (MODIFIERS.indexOf(key) !== -1) {
                pressed = _modifiers[key];
            }
            // 方向
            else if (Object.keys(ALIAS).indexOf(key) != -1) {
                // @ts-ignore
                pressed = _keyCodes[ALIAS[key]];
            }
            else {
                pressed = _keyCodes[key.toUpperCase().charCodeAt(0)];
            }
            if (!pressed)
                return false;
        }
        return true;
    };
    const keyboardPressed = (keys) => {
        if (Array.isArray(keys)) {
            return keys.findIndex(detection) > -1;
        }
        return detection(keys);
    };
    const destroyEvent = () => {
        document.removeEventListener('keydown', _onKeyDown, false);
        document.removeEventListener('keyup', _onKeyUp, false);
    };
    return {
        keyboardPressed,
        insertEvent,
        destroyEvent
    };
};

const getImgUrl = (code, jpg) => {
    return new URL(`../assets/imgs/sky/${code}/${jpg}`, import.meta.url).href;
};
const skys = ['216', '217', '218', '219', '220', '221', '222', '223', '224', '225', '226'];
// 背景
const useBackground = (code) => {
    const i = skys.findIndex(t => t == code);
    const index = ref(i < 0 ? 0 : i);
    const change = (scene) => {
        const code = skys[index.value];
        if (!code)
            return;
        load(scene, code);
        index.value++;
        if (index.value >= skys.length)
            index.value = 0;
    };
    // 获取背景组图
    const getBgGroup = (code) => {
        return ['posX.jpeg', 'negX.jpeg', 'posY.jpeg', 'negY.jpeg', 'posZ.jpeg', 'negZ.jpeg'].map(u => getImgUrl(code, u));
    };
    // 加载 -配合场景使用
    const load = (scene, code) => {
        const bgUrl = getBgGroup(code);
        if (typeof scene.setBgTexture === 'function') {
            scene.setBgTexture(bgUrl);
        }
        else {
            if (Array.isArray(bgUrl)) {
                const loader = new THREE.CubeTextureLoader();
                const env = loader.load(bgUrl);
                // 设置背景
                scene.background = env;
            }
            else {
                scene.background = new THREE.TextureLoader().load(bgUrl);
            }
        }
    };
    return {
        skys,
        index,
        change,
        changeBackground: change,
        load,
        getBgGroup,
        backgroundLoad: load
    };
};

// 模型加载 model-loader
const useModelLoader = (options = {}) => {
    // 数据库
    let gDB;
    // 颜色
    const color = {
        normal: 0x88a1b5,
        runing: 0x2e77f8,
        error: 0xc20c00
    };
    // 默认参数
    const _options = deepMerge({
        // 资源地址
        baseUrl: '',
        // draco 解压文件目录
        dracoPath: '/three/draco/gltf/',
        // basis 解压文件目录
        basisPath: '/three/basis/',
        // 模型 KB 倍数
        modelSizeKB: 1024 * 1024,
        // 颜色
        colors: {
            // 正常
            normal: {
                color: color.normal
            },
            // 运行
            runing: {
                color: color.runing
            },
            // 故障
            error: {
                color: color.error
            }
        },
        // 加载缓存
        loadCache: true,
        // 改变颜色材质网格名称集合
        colorMeshName: [],
        indexDB: {
            cache: true
        }
    }, options);
    const progress = reactive({
        // 进度
        percentage: 0,
        // 进度条展示
        show: false,
        // 是否加载结束（用于加载全部）
        isEnd: false,
        // 加载列表
        list: [],
        // 加载文件总大小
        total: 0,
        // 已经加载大小
        loaded: 0
    });
    // 模型类型映射
    const MODEL_MAP = {
        // base-基础底座,
        base: 'base',
        // device-场景设备,
        device: 'device',
        // font-字体,
        font: 'font',
        // sprite-精灵,
        sprite: 'sprite',
        // pipe-管路贴图
        pipe: 'pipe',
        // warning-警告标识,
        warning: 'warning',
        // remote-远程状态，
        remote: 'remote',
        // local-本地标识，
        local: 'local',
        // disabled-禁用标识
        disabled: 'disabled',
        // 聚光灯
        spotlight: 'spotlight'
    };
    const modelMap = new Map();
    const dracoLoader = new DRACOLoader$1();
    dracoLoader.setDecoderPath(_options.baseUrl + _options.dracoPath);
    const loader = new GLTFLoader$1();
    loader.setDRACOLoader(dracoLoader);
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath(_options.baseUrl + _options.basisPath);
    loader.setKTX2Loader(ktx2Loader);
    loader.setMeshoptDecoder(MeshoptDecoder);
    // 重置
    const reset = (length) => {
        if (length == 0) {
            progress.isEnd = true;
            progress.show = false;
            return false;
        }
        progress.isEnd = false;
        progress.percentage = 0;
        progress.show = true;
        return true;
    };
    // 计算加载大小
    const calcLoadSize = (models) => {
        for (let i = 0; i < models.length; i++) {
            progress.total += (models[i].size || 0) * _options.modelSizeKB;
        }
    };
    // 加载进度
    const loadProgress = (res) => {
        const loaded = res.loaded;
        const total = progress.total;
        let s = Number(((loaded + progress.loaded) / total) * 100);
        if (s > 100)
            s = 100;
        progress.percentage = Number(s.toFixed(2));
    };
    // 模型归一化
    const modelNormalization = (model, color, glb, animations) => {
        if (!glb)
            return;
        const { baseUrl, colorMeshName } = _options;
        const { mapUrl, key, mapMeshName, repeat = [1, 1] } = model;
        // let texture: InstanceType<typeof THREE.TextureLoader>
        let texture;
        if (mapUrl && mapMeshName) {
            texture = new THREE.TextureLoader().load(getUrl(mapUrl, baseUrl));
            texture.wrapS = THREE.RepeatWrapping; // THREE.RepeatWrapping，纹理将简单地重复到无穷大。
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(repeat[0], repeat[1]); // 纹理对象阵列
        }
        // 克隆
        const newModel = modelDeepClone(glb);
        newModel.traverse((el) => {
            if (el.isMesh && texture && el.name.indexOf(mapMeshName) > -1) {
                el.material = new THREE.MeshLambertMaterial({
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0,
                    map: texture.clone()
                });
            }
            else {
                // 默认颜色 动画颜色
                replaceMaterial(el, color, colorMeshName || []);
            }
        });
        if (mapUrl && mapMeshName) {
            newModel._mapMeshName_ = mapMeshName;
        }
        newModel.animations = animations;
        if (key) {
            modelMap.set(key, newModel);
        }
        return newModel;
    };
    // 打开数据库
    const openDB = () => {
        var _a, _b, _c;
        // 创建数据库
        return createDB(((_a = _options.indexDB) === null || _a === void 0 ? void 0 : _a.tbName) || DEFAULTCONFIG.indexdb.tbName, ((_b = _options.indexDB) === null || _b === void 0 ? void 0 : _b.dbName) || DEFAULTCONFIG.indexdb.dbName, ((_c = _options.indexDB) === null || _c === void 0 ? void 0 : _c.version) || DEFAULTCONFIG.indexdb.version).then(db => {
            if (!!db) {
                // 开启缓存
                THREE.Cache.enabled = true;
                gDB = db;
            }
            return db;
        });
    };
    // 获取缓存模型数据
    const getCacheModel = (url, size = 0) => {
        return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            // 加载缓存
            if (!_options.indexDB.cache)
                resolve(null);
            // three 缓存
            const tCache = THREE.Cache.get(url);
            if (!!tCache) {
                // 判断缓存的是否为 buffer 类型数据
                if (tCache instanceof ArrayBuffer) {
                    loadProgress({ loaded: tCache.byteLength });
                    loader.parse(tCache, '', result => {
                        THREE.Cache.add(url, result);
                        resolve(result);
                    });
                }
                else {
                    loadProgress({ loaded: size * _options.modelSizeKB });
                    setTimeout(() => {
                        resolve(tCache);
                    }, 10);
                }
            }
            else {
                // 数据库查询
                const store = yield getDataByKey(gDB, ((_a = _options.indexDB) === null || _a === void 0 ? void 0 : _a.tbName) || DEFAULTCONFIG.indexdb.tbName, url);
                if (!!store && store.data) {
                    const data = store.data;
                    if (typeof data === 'string') {
                        loadProgress({ loaded: data.length });
                        THREE.Cache.add(store.path, data);
                        setTimeout(() => {
                            resolve(data);
                        }, 10);
                    }
                    else {
                        loadProgress({ loaded: data.byteLength });
                        loader.parse(data, '', result => {
                            THREE.Cache.add(store.path, result);
                            resolve(result);
                        });
                    }
                }
                else {
                    resolve(null);
                }
            }
        }));
    };
    // db 缓存
    const dbStoreAdd = (url) => {
        var _a;
        // 加载缓存
        if (!_options.indexDB.cache)
            return;
        const ch = THREE.Cache.get(url);
        if (!ch)
            return;
        if (!!gDB) {
            const gDBTableName = ((_a = _options.indexDB) === null || _a === void 0 ? void 0 : _a.tbName) || DEFAULTCONFIG.indexdb.tbName;
            const db_tb = gDB.transaction(gDBTableName, 'readwrite').objectStore(gDBTableName);
            db_tb.add({ path: url, data: ch });
        }
    };
    // 加载模型
    const loadModel = (model, onProgress) => {
        const { key, url = '', size = 0 } = model;
        const { baseUrl, colors } = _options;
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            let color = colors.normal[key] || colors.normal.color;
            color = getColorArr(color)[0];
            const newUrl = getUrl(url, baseUrl);
            // 缓存
            const store = yield getCacheModel(newUrl, size);
            if (store) {
                const obj = store.scene.children[0];
                const del = modelNormalization(model, color, obj, store.animations);
                resolve(del);
                return;
            }
            // 判断文件类型是否为 glb
            let tmpArr = newUrl.split('.');
            let type = (tmpArr.pop() || '').toLowerCase();
            if (type !== 'glb') {
                throw new Error('模型类型错误,必须为 GLB 格式，当前格式：' + type);
            }
            loader.load(newUrl, glb => {
                const children = glb.scene.children;
                let object = new THREE.Group();
                if (children.length > 1) {
                    object.add(...children);
                }
                else {
                    object = children[children.length - 1];
                }
                const del = modelNormalization(model, color, object, glb.animations);
                dbStoreAdd(newUrl);
                resolve(del);
            }, res => {
                loadProgress(res);
                if (typeof onProgress === 'function')
                    onProgress(res);
            }, reject);
        }));
    };
    // 创建精灵
    const createSprite = (item) => {
        const { key, range = { x: 1, y: 1 }, mapUrl = '' } = item;
        // 创建精灵
        let texture = new THREE.TextureLoader().load(_options.baseUrl + mapUrl);
        // 精灵材质
        let material = new THREE.SpriteMaterial({
            map: texture
        });
        let sprite = new THREE.Sprite(material);
        let x = range.x, y = range.y;
        sprite.scale.set(x, y, 1);
        sprite.name = 'sprite';
        modelMap.set(key, sprite);
    };
    // 加载字体
    const loadFont = (model, onProgress) => {
        const { url = '', size = 0 } = model;
        const { baseUrl } = _options;
        const newUrl = getUrl(url, baseUrl);
        const loader = new FontLoader();
        return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            const store = yield getCacheModel(newUrl, size);
            if (store) {
                const font = loader.parse(JSON.parse(store));
                modelMap.set(MODEL_MAP.font, font);
                setTimeout(() => {
                    resolve(font);
                }, 10);
                return;
            }
            loader.load(newUrl, font => {
                modelMap.set(MODEL_MAP.font, font);
                dbStoreAdd(newUrl);
                resolve(font);
            }, res => {
                loadProgress(res);
                if (typeof onProgress === 'function')
                    onProgress(res);
            }, reject);
        }));
    };
    // 创建聚光灯
    const createSpotlight = (item) => {
        const { key, color = 0xffffff, intensity = 8, distance = 10, angle = Math.PI * 0.2, penumbra = 0.2, decay = 0 } = item;
        // 创建光源
        // 点光源 (颜色、强度、距离、角度、半影衰减、衰减)
        let spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
        // 生产阴影
        spotLight.castShadow = true;
        spotLight.visible = false;
        // let s = 800
        // spotLight.shadow.camera.right = s
        // spotLight.shadow.camera.left = -s
        // spotLight.shadow.camera.top = s
        // spotLight.shadow.camera.bottom = -s
        modelMap.set(key, spotLight);
    };
    // 加载全部模型
    const loadModels = (models, onSuccess, onProgress) => __awaiter(void 0, void 0, void 0, function* () {
        yield openDB();
        const max = models.length;
        if (!reset(max))
            return;
        // 计算模型文件总大小
        calcLoadSize(models);
        let index = 0;
        const _load = () => __awaiter(void 0, void 0, void 0, function* () {
            const item = models[index];
            const { type = MODEL_MAP.device, size = 0 } = item;
            switch (type) {
                case MODEL_MAP.device:
                case MODEL_MAP.pipe:
                    yield loadModel(item, onProgress);
                    break;
                case MODEL_MAP.sprite:
                    createSprite(item);
                    break;
                case MODEL_MAP.font:
                    yield loadFont(item, onProgress);
                    break;
                case MODEL_MAP.warning:
                    item.key = MODEL_MAP.warning;
                    yield loadModel(item, onProgress);
                    break;
                case MODEL_MAP.local:
                    item.key = MODEL_MAP.local;
                    yield loadModel(item, onProgress);
                    break;
                case MODEL_MAP.disabled:
                    item.key = MODEL_MAP.disabled;
                    yield loadModel(item, onProgress);
                    break;
                case MODEL_MAP.spotlight:
                    createSpotlight(item);
                    break;
            }
            index++;
            progress.loaded += size * _options.modelSizeKB;
            // 加载完成
            if (index >= max) {
                progress.percentage = 100;
                progress.isEnd = true;
                onSuccess();
            }
            else {
                _load();
            }
        });
        _load();
    });
    // 获取缓存模型
    const getModel = (key) => {
        const model = modelMap.get(key);
        return model;
    };
    // 设置模型虚化
    const setModelVirtualization = (model, opts = {}) => {
        // 默认参数
        opts = deepMerge({
            color: 0x00e0ff,
            wireframe: true,
            opacity: 0.5,
            filter: [],
            filterMatch: []
        }, opts);
        model.traverse((el) => {
            var _a;
            if (((_a = opts.filter) === null || _a === void 0 ? void 0 : _a.includes(el.name)) || matchFilter(el.name, opts.filterMatch)) {
                return;
            }
            if (el.isMesh) {
                if (!el.__material__) {
                    el.__material__ = el.material;
                }
                el.material = new THREE.MeshBasicMaterial({
                    color: opts.color,
                    wireframe: opts.wireframe,
                    transparent: true,
                    opacity: opts.opacity
                });
            }
        });
    };
    // 匹配过滤
    const matchFilter = (name = '', filters = []) => {
        return filters.filter(match => name.indexOf(match) > -1).length > 0;
    };
    // 虚化模型 其他模型传入则虚化除目标之外的模型
    const virtualization = (models = [], model, opts = {}) => {
        const filter = opts.filter || [];
        const filterMatch = opts.filterMatch || [];
        if (models.length) {
            for (let i = 0; i < models.length; i++) {
                const mod = models[i];
                if (model.uuid !== mod.uuid &&
                    !filter.includes(mod.name) &&
                    !matchFilter(mod.name, filterMatch)) {
                    setModelVirtualization(mod, opts);
                }
            }
        }
        else {
            // 虚化材质
            setModelVirtualization(model, opts);
        }
    };
    // 关闭虚化
    const closeVirtualization = (model) => {
        if (Array.isArray(model)) {
            for (let i = 0; i < model.length; i++) {
                model[i].traverse((el) => {
                    if (el.isMesh && el.__material__) {
                        el.material = el.__material__;
                    }
                });
            }
        }
        else {
            model.traverse((el) => {
                if (el.isMesh && el.__material__) {
                    el.material = el.__material__;
                }
            });
        }
    };
    return {
        progress,
        MODEL_MAP,
        loadModel,
        loadModels,
        getModel,
        virtualization,
        closeVirtualization
    };
};

var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    useConvertData: useConvertData,
    useCountryLine: useCountryLine,
    useMapBar: useMapBar,
    useOutline: useOutline,
    useMarkLight: useMarkLight,
    useFence: useFence,
    useCorrugatedPlate: useCorrugatedPlate,
    useDiffusion: useDiffusion,
    useFlywire: useFlywire,
    useLensflare: useLensflare,
    useFileLoader: useFileLoader,
    useUpload: useUpload,
    useCollide: useCollide,
    useCoord: useCoord,
    useRaycaster: useRaycaster,
    useCruise: useCruise,
    useCSS2D: useCSS2D,
    CSS2DRenderer: CSS2DRenderer,
    useCSS3D: useCSS3D,
    CSS3DRenderer: CSS3DRenderer,
    useFloor: useFloor,
    useDialog: useDialog,
    useGrid: useGrid,
    useMaterial: useMaterial,
    useMoveAnimate: useMoveAnimate,
    useRoam: useRoam,
    useOpenTheDoor: useOpenTheDoor,
    useKeyboardState: useKeyboardState,
    useBackground: useBackground,
    useModelLoader: useModelLoader
});

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
        const { visible, points, alway } = this.options.cruise;
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
        group.visible = alway;
        this.addObject(group);
    }
    // 巡航启动或关闭
    toggleCruise(close) {
        let { visible, runing, auto, alway } = this.options.cruise;
        if (!visible)
            return;
        runing = close != void 0 ? close : runing;
        this.options.cruise.runing = !runing;
        this.options.cruise.enabled = !runing;
        this.controls && (this.controls.enabled = auto || runing);
        this.cruiseGroup && !alway && (this.cruiseGroup.visible = !runing);
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
    // 销毁场景
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

export { index as Hooks, Scene, index$1 as Utils };
