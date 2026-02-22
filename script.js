(function () {
  // ========== 数据模型 ==========
  const BaijiRoutes = {
    routes: [
      {
        id: "red-tour",
        name: "路线一：红色游",
        duration: "1日",
        color: "#C41E3A",
        mapCenter: [29.7, 118.5],
        points: [
          {
            id: "commune",
            name: "白际人民公社旧址",
            latlng: [29.71, 118.51],
            icon: "red-star",
            description:
              '参观"两山馆"，看60年代的老物件，听讲解员讲述大集体时代的故事。',
            category: "red",
          },
          {
            id: "ancient-road",
            name: "徽开古道徒步",
            latlng: [29.72, 118.52],
            icon: "green-leaf",
            description:
              '沿着青石板路徒步约2公里（平缓路段），寻找古道旁的"红军标语墙"遗址，体验当年红军的行军环境。',
            category: "green",
          },
          {
            id: "shishi-base",
            name: "狮石红色教育基地",
            latlng: [29.73, 118.53],
            icon: "red-star",
            description:
              "核心展馆：红色狮石革命村史馆（程氏树德堂），记录方志敏红军战斗历史。特色展馆：清贫文化礼堂，弘扬方志敏《清贫》精神。",
            category: "red",
          },
        ],
      },
      {
        id: "nature-tour",
        name: "路线二：自然游<br>（森林康养）",
        duration: "2日自驾",
        color: "#228B22",
        mapCenter: [29.7, 118.5],
        points: [
          {
            id: "viewpoint",
            name: "徽州天路观景台",
            latlng: [29.74, 118.54],
            icon: "green-leaf",
            description:
              '挑战"华东第一弯"，在最高点观景台停车，拍摄云海和盘山公路的"上帝视角"。',
          },
          {
            id: "terraces",
            name: "严池高山梯田",
            latlng: [29.75, 118.55],
            icon: "yellow-wheat",
            description:
              "徒步木栈道，春天看油菜花海，夏天看翡翠梯田，秋天看金色稻浪。",
          },
          {
            id: "waterfall",
            name: "百丈冲瀑布群",
            latlng: [29.76, 118.56],
            icon: "blue-water",
            description: "亲水徒步，拍摄飞流直下的瀑布，夏天可在此戏水纳凉。",
          },
        ],
      },
      {
        id: "family-tour",
        name: "路线三：亲子/研学游",
        duration: "3日",
        color: "#FF8C00",
        mapCenter: [29.7, 118.5],
        points: [
          {
            id: "canyon",
            name: "白际大峡谷",
            latlng: [29.77, 118.57],
            icon: "blue-water",
            description:
              "穿上雨靴，在大峡谷里寻找奇形怪状的石头和昆虫，做自然笔记。",
          },
          {
            id: "water-gun",
            name: "瀑布水枪",
            latlng: [29.78, 118.58],
            icon: "yellow-star",
            description: "安全水域内的亲子互动游戏，释放孩子天性。",
          },
          {
            id: "star-gazing",
            name: "星空观测点",
            latlng: [29.79, 118.59],
            icon: "yellow-star",
            description: "白际乡光污染极少，用天文望远镜观测银河和星座。",
          },
        ],
      },
      {
        id: "agri-tour",
        name: "路线四：非遗/务农游",
        duration: "2日",
        color: "#8B4513",
        mapCenter: [29.7, 118.5],
        points: [
          {
            id: "oil-mill",
            name: "传统榨油坊",
            latlng: [29.8, 118.6],
            icon: "yellow-wheat",
            description: "观看传统木榨榨油的过程，了解菜籽油的制作工艺。",
          },
          {
            id: "fire-cooking",
            name: "土灶大锅饭",
            latlng: [29.81, 118.61],
            icon: "red-fire",
            description: "在严池村民家中，体验用大铁锅炒菜、烧柴火饭。",
          },
          {
            id: "tea-picking",
            name: "采茶制茶",
            latlng: [29.82, 118.62],
            icon: "green-leaf",
            description: "在茶园采摘茶叶，跟着师傅学习杀青和揉捻。",
          },
        ],
      },
    ],
    specialties: ["白际红薯干", "笋干", "土鸡蛋", "高山云雾茶", "野生葛粉"],
  };

  // 初始化地图
  const firstRoute = BaijiRoutes.routes[0];
  const startPoint = firstRoute.points[0].latlng;
  const map = L.map("map").setView(startPoint, 13);
  L.tileLayer(
    "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    {
      subdomains: "1234",
      attribution: "高德地图",
    }
  ).addTo(map);

  let currentMarkers = [];
  let currentPolyline = null;
  let activeRouteId = null;

  function getIconByCategory(category, routeColor = "#C41E3A") {
    let html = "";
    if (category === "red" || category === "red-star")
      html =
        '<div style="background:#C41E3A; width:30px; height:30px; border-radius:50% 10% 50% 50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 2px 6px black;"><span style="color:white; font-size:20px;">★</span></div>';
    else if (category === "green" || category === "green-leaf")
      html =
        '<div style="background:#2E8B57; width:32px; height:32px; border-radius:50% 0 50% 0; display:flex; align-items:center; justify-content:center; border:2px solid #f5e2c1;"><span style="color:white; font-size:20px;">🌿</span></div>';
    else if (category === "yellow-wheat")
      html =
        '<div style="background:#D4AF37; width:32px; height:32px; border-radius:4px 50% 4px 50%; display:flex; align-items:center; justify-content:center; border:2px solid #644117;"><span style="font-size:20px;">🌾</span></div>';
    else if (category === "blue-water")
      html =
        '<div style="background:#4682B4; width:32px; height:32px; border-radius:30% 70% 30% 30%; display:flex; align-items:center; justify-content:center; border:2px solid #f0e6d2;"><span style="color:white; font-size:20px;">💧</span></div>';
    else if (category === "yellow-star")
      html =
        '<div style="background:#FFD700; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #b8860b;"><span style="font-size:20px;">⭐</span></div>';
    else if (category === "red-fire")
      html =
        '<div style="background:#E25822; width:32px; height:32px; border-radius:10% 60% 10% 60%; display:flex; align-items:center; justify-content:center; border:2px solid #4a251b;"><span style="color:white;">🔥</span></div>';
    else
      html =
        '<div style="background:#999; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white;"><span>📍</span></div>';

    return L.divIcon({
      className: "custom-marker",
      html: html,
      iconSize: [34, 34],
      popupAnchor: [0, -18],
    });
  }

  function clearLayers() {
    currentMarkers.forEach((m) => map.removeLayer(m));
    currentMarkers = [];
    if (currentPolyline) map.removeLayer(currentPolyline);
  }

  function loadRouteMap(routeId) {
    const route = BaijiRoutes.routes.find((r) => r.id === routeId);
    if (!route) return;
    activeRouteId = routeId;
    clearLayers();

    // 设置地图中心到该路线的第一个图标上
    if (route.points.length > 0) {
      map.flyTo(route.points[0].latlng, 13, { duration: 1.8 });
    }

    const pointLatLngs = route.points.map((p) => p.latlng);
    currentPolyline = L.polyline(pointLatLngs, {
      color: route.color,
      weight: 3,
      opacity: 0.8,
      dashArray: "8, 6",
      interactive: false,
      renderer: L.canvas(),
    }).addTo(map);

    // 立即强制重绘
    setTimeout(() => {
      if (currentPolyline._renderer) {
        currentPolyline._renderer._update();
      }
    }, 10);

    route.points.forEach((point) => {
      const icon = getIconByCategory(point.icon || point.category, route.color);
      const marker = L.marker(point.latlng, { icon }).addTo(map);

      let popupClass = "custom-popup-red";
      if (routeId === "nature-tour") popupClass = "custom-popup-green";
      else if (routeId === "family-tour") popupClass = "custom-popup-orange";
      else if (routeId === "agri-tour") popupClass = "custom-popup-brown";

      // 为白际人民公社标记添加图片轮播弹窗
      if (point.name.includes("白际人民公社")) {
        const popupContent = `
                    <b style="font-size:1.1rem;">${point.name}</b><br>
                    <span style="font-size:0.9rem;">${point.description}</span>
                    <div style="margin-top:10px;">
                    <div style="font-size:0.8rem; margin-bottom:8px;"><i class="fas fa-camera"></i> 实景影像</div>
                    <div style="width:240px; height:180px; border-radius:8px; overflow:hidden; margin:0 auto; border:1px solid #ddd; position:relative;">
                        <img src="./白际人民公社/1.jpg" alt="白际人民公社旧址" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;" class="commune-img active">
                        <img src="./白际人民公社/2.jpg" alt="白际人民公社旧址" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0;" class="commune-img">
                        <img src="./白际人民公社/3.jpg" alt="白际人民公社旧址" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0;" class="commune-img">
                        <img src="./白际人民公社/4.jpg" alt="白际人民公社旧址" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0;" class="commune-img">
                        <img src="./白际人民公社/5.jpg" alt="白际人民公社旧址" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0;" class="commune-img">
                    </div>
                        <div class="commune-indicators" style="display:flex; justify-content:center; gap:8px; margin-top:8px;">
                        <span class="commune-indicator active" onclick="showCommuneImage(0)" data-index="0" style="width:12px; height:12px; border-radius:50%; background:#C41E3A; cursor:pointer; transition: all 0.3s ease; transform: scale(1.2);"></span>
                        <span class="commune-indicator" onclick="showCommuneImage(1)" data-index="1" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                        <span class="commune-indicator" onclick="showCommuneImage(2)" data-index="2" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                        <span class="commune-indicator" onclick="showCommuneImage(3)" data-index="3" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                        <span class="commune-indicator" onclick="showCommuneImage(4)" data-index="4" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                    </div>
                        <div style="text-align:center; margin-top:3px; font-size:0.6rem; color:#999;">
                            点击圆点切换图片
                        </div>
                    </div>
                    <small style="font-size:0.7rem;">👣 类别: ${point.category}</small>
                `;

        marker.bindPopup(popupContent, {
          className: popupClass,
          maxWidth: 220,
          closeOnClick: false, // 点击地图不关闭弹窗
          autoClose: false, // 鼠标离开标记不自动关闭
          closeOnEscapeKey: false, // 按ESC键不关闭弹窗
        });

        // 启动自动轮播
        marker.on("popupopen", function () {
          startCommuneCarousel();
        });

        // 简单的弹窗控制：鼠标移到弹窗上不消失
        marker.on("popupopen", function () {
          // 禁用自动关闭
          if (marker._popup) {
            marker._popup.options.autoClose = false;

            // 给弹窗添加鼠标事件
            const popupElement = marker._popup.getElement();
            if (popupElement) {
              // 鼠标进入弹窗 - 保持打开
              popupElement.addEventListener("mouseenter", function () {
                // 弹窗保持打开
              });

              // 鼠标离开弹窗 - 关闭
              popupElement.addEventListener("mouseleave", function () {
                marker.closePopup();
              });
            }
          }
        });

        // 标记鼠标离开时，检查鼠标是否在弹窗上
        marker.on("mouseout", function (e) {
          const popupElement = marker.getPopup()?.getElement();
          if (popupElement) {
            // 延迟检查，给鼠标时间移动到弹窗
            setTimeout(() => {
              const popupRect = popupElement.getBoundingClientRect();
              const mouseX = e.originalEvent.clientX;
              const mouseY = e.originalEvent.clientY;

              // 如果鼠标在弹窗区域内，不关闭弹窗
              const isMouseInPopup =
                mouseX >= popupRect.left &&
                mouseX <= popupRect.right &&
                mouseY >= popupRect.top &&
                mouseY <= popupRect.bottom;

              if (!isMouseInPopup) {
                marker.closePopup();
              }
            }, 100);
          } else {
            marker.closePopup();
          }
        });

        marker.on("popupclose", function () {
          stopCommuneCarousel();
        });
      } else if (point.id === "ancient-road") {
        // 徽开古道弹窗内容
        const popupContent = `
                    <div class="popup-content" style="text-align:center; max-width:240px;">
                        <h4 style="margin:0 0 10px 0; color:#C41E3A;">徽开古道</h4>
                        <p style="margin:0 0 10px 0; font-size:12px; color:#666;">
                            徽开古道是古代徽州通往浙江开化的商道，全长约25公里，沿途风景秀丽，历史文化底蕴深厚。
                        </p>
                        <div style="background:#f5f5f5; padding:8px; border-radius:6px; margin-bottom:10px;">
                            <strong style="color:#C41E3A;">游玩特色：</strong><br>
                            古道徒步、自然风光、历史文化
                        </div>
                        <div style="background:#f5f5f5; padding:8px; border-radius:6px;">
                            <strong style="color:#C41E3A;">实景影像：</strong><br>
                            <div style="width:240px; height:180px; border-radius:8px; overflow:hidden; margin:0 auto; border:1px solid #ddd; position:relative;">
                                <img src="徽开古道/1.jpg" alt="徽开古道照片1" class="huikai-img active" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:1; transition:opacity 0.5s ease;">
                                <img src="徽开古道/2.jpg" alt="徽开古道照片2" class="huikai-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                                <img src="徽开古道/3.jpg" alt="徽开古道照片3" class="huikai-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                                <img src="徽开古道/4.jpg" alt="徽开古道照片4" class="huikai-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                                <img src="徽开古道/5.jpg" alt="徽开古道照片5" class="huikai-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                            </div>
                            <div style="display:flex; justify-content:center; gap:8px; margin-top:8px;">
                                <span class="huikai-indicator active" onclick="showHuikaiImage(0)" data-index="0" style="width:12px; height:12px; border-radius:50%; background:#C41E3A; cursor:pointer; transition: all 0.3s ease; transform: scale(1.2);"></span>
                                <span class="huikai-indicator" onclick="showHuikaiImage(1)" data-index="1" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                                <span class="huikai-indicator" onclick="showHuikaiImage(2)" data-index="2" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                                <span class="huikai-indicator" onclick="showHuikaiImage(3)" data-index="3" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                                <span class="huikai-indicator" onclick="showHuikaiImage(4)" data-index="4" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                            </div>
                        </div>
                    </div>
                `;

        marker.bindPopup(popupContent, {
          maxWidth: 280,
          closeOnClick: false,
          autoClose: false,
          closeOnEscapeKey: false,
        });

        marker.on("popupopen", function () {
          startHuikaiCarousel();
        });

        marker.on("popupclose", function () {
          stopHuikaiCarousel();
        });
      } else if (point.id === "shishi-base") {
        // 狮石红色教育基地弹窗内容
        const popupContent = `
                    <div class="popup-content" style="text-align:center; max-width:240px;">
                        <h4 style="margin:0 0 10px 0; color:#C41E3A;">狮石红色教育基地</h4>
                        <p style="margin:0 0 10px 0; font-size:12px; color:#666;">
                            核心展馆：红色狮石革命村史馆（程氏树德堂），记录方志敏红军战斗历史。特色展馆：清贫文化礼堂，弘扬方志敏《清贫》精神。
                        </p>
                        <div style="background:#f5f5f5; padding:8px; border-radius:6px; margin-bottom:10px;">
                            <strong style="color:#C41E3A;">游玩特色：</strong><br>
                            革命历史、红色文化、爱国主义教育
                        </div>
                        <div style="background:#f5f5f5; padding:8px; border-radius:6px;">
                            <strong style="color:#C41E3A;">实景影像：</strong><br>
                            <div style="width:240px; height:180px; border-radius:8px; overflow:hidden; margin:0 auto; border:1px solid #ddd; position:relative;">
                                <img src="红狮教育基地/1.jpg" alt="狮石红色教育基地照片1" class="shishi-img active" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:1; transition:opacity 0.5s ease;">
                                <img src="红狮教育基地/2.jpg" alt="狮石红色教育基地照片2" class="shishi-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                                <img src="红狮教育基地/3.jpg" alt="狮石红色教育基地照片3" class="shishi-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                                <img src="红狮教育基地/4.jpg" alt="狮石红色教育基地照片4" class="shishi-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                                <img src="红狮教育基地/5.jpg" alt="狮石红色教育基地照片5" class="shishi-img" style="width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0; opacity:0; transition:opacity 0.5s ease;">
                            </div>
                            <div style="display:flex; justify-content:center; gap:8px; margin-top:8px;">
                                <span class="shishi-indicator active" onclick="showShishiImage(0)" data-index="0" style="width:12px; height:12px; border-radius:50%; background:#C41E3A; cursor:pointer; transition: all 0.3s ease; transform: scale(1.2);"></span>
                                <span class="shishi-indicator" onclick="showShishiImage(1)" data-index="1" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                                <span class="shishi-indicator" onclick="showShishiImage(2)" data-index="2" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                                <span class="shishi-indicator" onclick="showShishiImage(3)" data-index="3" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transition: all 0.3s ease;"></span>
                                <span class="shishi-indicator" onclick="showShishiImage(4)" data-index="4" style="width:12px; height:12px; border-radius:50%; background:#ccc; cursor:pointer; transitio
