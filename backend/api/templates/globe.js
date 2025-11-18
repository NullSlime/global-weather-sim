export function initGlobe(THREE) {
    const canvas = document.getElementById("globe");
    if (!canvas) {
        console.error("Canvas #globe not found!");
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 5;

    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x2266ff });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // --------------------------------------------
    // ① 緯度・経度を XYZ 座標に変換（追加）
    // --------------------------------------------
    function latLonToXYZ(lat, lon, radius) {
        const latRad = (lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180;

        return {
            x: radius * Math.cos(latRad) * Math.cos(lonRad),
            y: radius * Math.sin(latRad),
            z: radius * Math.cos(latRad) * Math.sin(lonRad),
        };
    }

    // --------------------------------------------
    // ② 点を球面上に描画する（追加）
    // --------------------------------------------
    function drawPoint(pos, temperature) {
        const pointGeo = new THREE.SphereGeometry(0.05, 12, 12);

        // 温度をもとに色を作成（青→赤）
        const color = new THREE.Color();
        const normalized = Math.min(Math.max(temperature / 40, 0), 1);
        color.setHSL((1 - normalized) * 0.7, 1, 0.5);

        const pointMat = new THREE.MeshStandardMaterial({ color });
        const point = new THREE.Mesh(pointGeo, pointMat);

        point.position.set(pos.x, pos.y, pos.z);
        scene.add(point);
    }

    function drawStationPoint(pos) {
        const pointGeo = new THREE.SphereGeometry(0.015, 6, 6);
        const pointMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const point = new THREE.Mesh(pointGeo, pointMat);

        point.position.set(pos.x, pos.y, pos.z);
        scene.add(point);
    }

    // --------------------------------------------
    // ③ Django API（Open-Meteo 連携）から気象データ取得（既存コード）
    // --------------------------------------------
    fetch("/api/stations/")
        .then(res => res.json())
        .then(data => {
            data.stations.forEach(st => {
                const { lat, lon } = st;

                // 不正データの除外
                if (lat === null || lon === null) return;

                const xyz = latLonToXYZ(lat, lon, 2.05);
                drawStationPoint(xyz);
            });
        });

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
}
