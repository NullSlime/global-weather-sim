export function initGlobe(THREE) {
    const canvas = document.getElementById("globe");
    if (!canvas) {
        console.error("Canvas #earth not found!");
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

    // ================================
    // 1. グループを作成（追加）
    // ================================
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 球体
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0x2266ff });
    const sphere = new THREE.Mesh(geometry, material);
    earthGroup.add(sphere);   // ← ここが重要！

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    // 緯度経度 → XYZ
    function latLonToXYZ(lat, lon, radius) {
        const latRad = (lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180;

        return {
            x: radius * Math.cos(latRad) * Math.cos(lonRad),
            y: radius * Math.sin(latRad),
            z: radius * Math.cos(latRad) * Math.sin(lonRad),
        };
    }

    // 観測点を描画（Group に追加）
    function drawStationPoint(pos) {
        const geo = new THREE.SphereGeometry(0.03, 6, 6);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const point = new THREE.Mesh(geo, mat);
        point.position.set(pos.x, pos.y, pos.z);

        earthGroup.add(point);   // ← 球体と同じグループに追加！
    }

    // NOAA（または Django API）からステーション読込
    fetch("http://127.0.0.1:8000/api/stations?count=1500")
        .then(res => res.json())
        .then(data => {
            data.stations.forEach(s => {
                const { lat, lon } = s;
                if (!lat || !lon) return;

                const xyz = latLonToXYZ(lat, lon, 2.05);
                drawStationPoint(xyz);
            });
        });

    // ================================
    // 2. グループを回転（追加）
    // ================================
    function animate() {
        requestAnimationFrame(animate);

        earthGroup.rotation.y += 0.005; // ← 全体を回す！

        renderer.render(scene, camera);
    }
    animate();
}
