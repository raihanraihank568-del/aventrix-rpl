
(async () => {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized.');
        return;
    }

    // --- 1. Prestasi ---
    const achievementsContainer = document.getElementById('achievements-container');
    if (achievementsContainer) {
        // Fetch data
        const { data, error } = await window.supabaseClient.from('achievements').select('*');
        if (error) {
            console.error('Error fetching achievements:', error);
        } else if (data && data.length > 0) {
            console.log('Fetched achievements:', data);
        }
    }

    // --- Local Student Photo Mapping ---
    const localStudentPhotos = {
        1: 'images/1.jpg',
        2: 'images/2.png',
        3: 'images/3.jpeg',
        4: 'images/4.jpg',
        5: 'images/5.jpg',
        6: 'images/6.jpg',
        7: 'images/7.jpg',
        8: 'images/8.jpeg',
        9: 'images/9.JPG',
        10: 'images/10.png',
        11: 'images/11.JPG',
        12: 'images/12.jpg',
        13: 'images/13.jpg',
        14: 'images/14.jpg',
        15: 'images/15.jpg',
        16: 'images/16.png',
        17: 'images/17.png',
        18: 'images/18.png',
        19: 'images/19.jpg',
        20: 'images/20.jpg',
        21: 'images/21.jpg',
        22: 'images/22.jpg',
        23: 'images/23.png',
        24: 'images/24.png',
        25: 'images/25.jpg',
        26: 'images/26.jpg',
        27: 'images/27.jpeg',
        28: 'images/28.jpg',
        29: 'images/29.jpeg',
        30: 'images/30.jpeg',
        31: 'images/31.jpg',
        32: 'images/32.webp',
        33: 'images/33.jpg',
        34: 'images/34.jpg',
        35: 'images/35.jpg'
    };

    function getStudentPhotoUrl(profile) {
        if (!profile) return 'https://api.dicebear.com/7.x/initials/svg?seed=Unknown&backgroundColor=00288e,7C3AED&textColor=ffffff';
        if (profile.foto_url && profile.foto_url.trim() !== '') {
            return profile.foto_url;
        }
        const noAbsen = profile.nomor_absen ? parseInt(profile.nomor_absen, 10) : null;
        if (noAbsen && localStudentPhotos[noAbsen]) {
            return localStudentPhotos[noAbsen];
        }
        return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.nama || 'Siswa')}&backgroundColor=00288e,7C3AED&textColor=ffffff`;
    }

    // --- 2. Anggota Kelas (List) ---
    const membersContainer = document.getElementById('members-container');
    if (membersContainer) {
        const { data, error } = await window.supabaseClient.from('profiles').select('*').order('nomor_absen', { ascending: true });
        if (error) {
            console.error('Error fetching profiles:', error);
        } else if (data) {
            // Function to render cards cleanly
            const renderMemberCards = (list) => {
                if (!list || list.length === 0) {
                    membersContainer.innerHTML = `<div class="col-span-full text-center py-12 text-on-surface-variant italic font-body-md">Tidak ada data siswa yang ditemukan.</div>`;
                    return;
                }

                membersContainer.innerHTML = list.map(profile => {
                    const avatarUrl = getStudentPhotoUrl(profile);
                    const noAbsen = profile.nomor_absen ? profile.nomor_absen.toString().padStart(2, '0') : '00';
                    const hasSpecialRole = profile.jabatan && profile.jabatan !== 'Anggota';
                    const isSekretaris1 = profile.nama && (profile.nama.includes('Jorel') || profile.jabatan === 'Sekretaris 1' || profile.nomor_absen === 13);
                    const customObjectPos = isSekretaris1 ? 'style="object-position: center 15%;"' : '';

                    return `
                    <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-outline-variant/30 hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col h-full relative">
                        <!-- Photo container with floating badge overlay -->
                        <div class="aspect-[3/4] overflow-hidden bg-surface-variant flex items-center justify-center relative">
                            <img class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out" ${customObjectPos} alt="Avatar ${profile.nama}" src="${avatarUrl}" loading="lazy" onerror="this.onerror=null; this.src='https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.nama)}&backgroundColor=00288e,7C3AED&textColor=ffffff';">
                            
                            <!-- Floating Attendance Badge (Pill overlay on photo) -->
                            <div class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider shadow-md border border-white/20 flex items-center gap-1.5 z-10">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span>ABSEN ${noAbsen}</span>
                            </div>
                        </div>

                        <!-- Card Body Content -->
                        <div class="p-5 flex flex-col flex-grow">
                            <!-- Student Name -->
                            <h3 class="font-bold text-base md:text-lg text-on-surface line-clamp-1 group-hover:text-primary transition-colors mb-1.5" title="${profile.nama}">
                                ${profile.nama}
                            </h3>

                            <!-- Badges Row -->
                            <div class="flex flex-wrap items-center gap-1.5 mb-3">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold">
                                    No. Absen ${noAbsen}
                                </span>
                                ${hasSpecialRole ? `<span class="inline-flex items-center px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-bold">${profile.jabatan}</span>` : ''}
                            </div>

                            <!-- Self Description -->
                            <p class="text-on-surface-variant text-xs italic mb-4 line-clamp-2 min-h-[32px]">
                                "${profile.deskripsi_diri || 'Siswa XII RPL'}"
                            </p>

                            <!-- Link to Detail -->
                            <a class="mt-auto text-primary font-label-caps text-[11px] font-bold flex items-center gap-1.5 hover:translate-x-1 transition-transform pt-3 border-t border-slate-100" href="detail-anggota.html?id=${profile.nomor_absen}">
                                Lihat Detail <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </a>
                        </div>
                    </div>`;
                }).join('');
            };

            // Female student attendance numbers list
            const femaleAbsenNumbers = [3, 4, 5, 8, 9, 11, 14, 15, 18, 19, 23, 25, 26, 27, 32, 34];

            // Dynamically assign gender ('P' or 'L') for each profile
            data.forEach(p => {
                p.jenis_kelamin = femaleAbsenNumbers.includes(p.nomor_absen) ? 'P' : 'L';
            });

            let activeGender = 'all';
            let activeSearch = '';

            const applyFilters = () => {
                let filtered = data;
                if (activeGender !== 'all') {
                    filtered = filtered.filter(p => p.jenis_kelamin === activeGender);
                }
                if (activeSearch) {
                    filtered = filtered.filter(p => 
                        (p.nama && p.nama.toLowerCase().includes(activeSearch)) ||
                        (p.nomor_absen && p.nomor_absen.toString().includes(activeSearch)) ||
                        (p.jabatan && p.jabatan.toLowerCase().includes(activeSearch))
                    );
                }
                
                // Update title count
                const titleCount = document.getElementById('members-count-title');
                if (titleCount) {
                    const genderLabel = activeGender === 'L' ? 'Laki-laki' : activeGender === 'P' ? 'Perempuan' : '';
                    titleCount.textContent = `Anggota Kelas ${genderLabel ? '(' + genderLabel + ') ' : ''}- ${filtered.length} Siswa`;
                }

                renderMemberCards(filtered);
            };

            // Gender Filter Event Listeners (Instant touch response)
            const genderButtons = document.querySelectorAll('.gender-btn');
            if (genderButtons.length > 0) {
                genderButtons.forEach(btn => {
                    const handleGenderSwitch = (e) => {
                        e.preventDefault();
                        genderButtons.forEach(b => {
                            b.classList.remove('bg-primary', 'text-white', 'shadow-sm');
                            b.classList.add('text-on-surface-variant');
                        });
                        btn.classList.add('bg-primary', 'text-white', 'shadow-sm');
                        btn.classList.remove('text-on-surface-variant');

                        const targetGender = btn.getAttribute('data-gender') || 'all';
                        if (activeGender !== targetGender) {
                            activeGender = targetGender;
                            applyFilters();
                        }
                    };
                    btn.addEventListener('pointerdown', handleGenderSwitch);
                    btn.addEventListener('click', handleGenderSwitch);
                });
            }

            // Search filter event listener
            const searchInput = document.getElementById('member-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    activeSearch = e.target.value.toLowerCase().trim();
                    applyFilters();
                });
            }

            // Render initial state
            applyFilters();
            
            // --- Update Organizational Structure avatars if they exist ---
            const getAvatar = (profile) => getStudentPhotoUrl(profile);

            const ketua = data.find(p => p.jabatan === 'Ketua Kelas');
            if (ketua && document.getElementById('img-ketua')) document.getElementById('img-ketua').src = getAvatar(ketua);

            const wakil = data.find(p => p.jabatan === 'Wakil Ketua Kelas' || p.jabatan === 'Wakil Ketua');
            if (wakil && document.getElementById('img-wakil')) document.getElementById('img-wakil').src = getAvatar(wakil);

            const sek1 = data.find(p => p.nama === 'Jorel Permana' || p.nama.includes('Jorel'));
            if (sek1 && document.getElementById('img-sekretaris-1')) {
                const el = document.getElementById('img-sekretaris-1');
                el.src = getAvatar(sek1);
                el.style.objectPosition = 'center 15%';
            }

            const sek2 = data.find(p => p.nama.includes('Mikhaela'));
            if (sek2 && document.getElementById('img-sekretaris-2')) document.getElementById('img-sekretaris-2').src = getAvatar(sek2);

            const ben1 = data.find(p => p.nama.includes('Bima Mahesa'));
            if (ben1 && document.getElementById('img-bendahara-1')) document.getElementById('img-bendahara-1').src = getAvatar(ben1);

            const ben2 = data.find(p => p.nama.includes('Avniela'));
            if (ben2 && document.getElementById('img-bendahara-2')) document.getElementById('img-bendahara-2').src = getAvatar(ben2);
        }
    }

    // --- Helper to resolve CV file path for each student ---
    function getStudentCvUrl(profile) {
        if (!profile || !profile.nomor_absen) return 'cv/1.pdf';
        const noAbsen = parseInt(profile.nomor_absen, 10);

        // Exact file mapping according to attendance number (1-35)
        const cvFilesByAbsen = {
            1: 'cv/1.pdf',
            2: 'cv/2.jpg',
            3: 'cv/3.jpg',
            4: 'cv/4.jpg',
            5: 'cv/5.jpg',
            6: 'cv/6.pdf',
            7: 'cv/7.pdf',
            8: 'cv/8.pdf',
            9: 'cv/9.pdf',
            10: 'cv/10.jpg',
            11: 'cv/11.pdf',
            12: 'cv/12.png',
            13: 'cv/13.png',
            14: 'cv/14.pdf',
            15: 'cv/15.pdf',
            16: 'cv/16.pdf',
            17: 'cv/17.jpg',
            18: 'cv/18.png',
            22: 'cv/22.jpg',
            23: 'cv/23.png',
            24: 'cv/24.pdf',
            25: 'cv/25.jpg',
            26: 'cv/26.png',
            27: 'cv/27.pdf',
            28: 'cv/28.pdf',
            29: 'cv/29.pdf',
            30: 'cv/30.pdf',
            31: 'cv/31.pdf',
            32: 'cv/32.png',
            33: 'cv/33.pdf',
            34: 'cv/34.pdf',
            35: 'cv/35.pdf'
        };

        if (cvFilesByAbsen[noAbsen]) {
            return cvFilesByAbsen[noAbsen];
        }

        // Fallback default
        return `cv/${noAbsen}.pdf`;
    }

    // --- 2.5 Anggota Kelas (Detail) ---
    if (window.location.pathname.includes('detail-anggota.html') || window.location.pathname.includes('detailed_anggota.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            const { data, error } = await window.supabaseClient.from('profiles').select('*').eq('nomor_absen', id).single();
            if (error) {
                console.error('Error fetching detail profile:', error);
            } else if (data) {
                // DOM Injections
                const setEl = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
                
                setEl('detail-nama', data.nama);
                setEl('detail-nama-title', data.nama);
                setEl('detail-absen', `XII RPL - No. Absen ${data.nomor_absen.toString().padStart(2, '0')}`);
                setEl('detail-ttl', `${data.tempat_lahir || '-'}, ${data.tanggal_lahir ? new Date(data.tanggal_lahir).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}`);
                setEl('detail-whatsapp', data.nomor_whatsapp || '-');
                setEl('detail-alamat', data.alamat_rumah || '-');
                setEl('detail-jabatan', data.jabatan || 'Anggota');
                setEl('detail-deskripsi', data.deskripsi_diri || 'Belum ada deskripsi.');

                // Download CV button mapping
                const cvUrl = getStudentCvUrl(data);
                const cvBtn = document.getElementById('detail-cv-btn');
                if (cvBtn && cvUrl) {
                    cvBtn.href = cvUrl;
                    cvBtn.setAttribute('download', '');
                    cvBtn.target = '_blank';
                }
                
                const quoteEl = document.getElementById('detail-motivasi');
                if (quoteEl) quoteEl.textContent = data.kata_motivasi ? `"${data.kata_motivasi}"` : '"Terus belajar dan berkembang."';
                
                const hobiContainer = document.getElementById('detail-hobi-container');
                if (hobiContainer) {
                    if (data.hobi) {
                        const hobbies = data.hobi.split(',').map(h => h.trim());
                        hobiContainer.innerHTML = hobbies.map(h => `<span class="bg-primary/10 text-primary px-4 py-2 rounded-full font-body-md font-semibold">${h}</span>`).join('');
                    } else {
                        hobiContainer.innerHTML = '<span class="text-on-surface-variant font-body-md">Belum ada data hobi.</span>';
                    }
                }

                const avatarEl = document.getElementById('detail-avatar');
                if (avatarEl) {
                    avatarEl.src = getStudentPhotoUrl(data);
                    if (data.nama && (data.nama.includes('Jorel') || data.nomor_absen === 13 || data.jabatan === 'Sekretaris 1')) {
                        avatarEl.style.objectPosition = 'center 15%';
                    }
                }
            }
        }
    }

    // --- 3. Jadwal Mapel ---
    const jadwalMapelTable = document.getElementById('jadwal-mapel-table');
    if (jadwalMapelTable) {
        const { data, error } = await window.supabaseClient.from('schedules').select('*');
        if (error) console.error('Error fetching schedules:', error);
        else if (data) console.log('Fetched schedules:', data);
    }

    // --- 4. Jadwal Piket ---
    const jadwalPiketContainer = document.getElementById('jadwal-piket-container');
    if (jadwalPiketContainer) {
        const { data, error } = await window.supabaseClient.from('picket_schedules').select('*');
        if (error) console.error('Error fetching picket schedules:', error);
        else if (data) console.log('Fetched picket schedules:', data);
    }

    // --- 5. Administrasi (Inventaris, Absensi, Jurnal) ---
    const inventarisContainer = document.getElementById('inventaris-container');
    const inventarisBody = document.getElementById('inventaris-table-body');
    if (inventarisContainer && inventarisBody) {
        const { data, error } = await window.supabaseClient.from('inventaris_kelas').select('*');
        if (error) {
            console.error('Error fetching inventaris:', error);
            inventarisBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Gagal memuat data inventaris.</td></tr>';
        } else if (data) {
            // Calculate metrics
            const totalItems = data.length;
            const kondisiBaik = data.filter(item => item.kondisi === 'Baik').length;
            const perluPerhatian = data.filter(item => item.kondisi !== 'Baik').length;

            const mTotal = document.getElementById('metric-total');
            const mBaik = document.getElementById('metric-baik');
            const mRusak = document.getElementById('metric-rusak');
            if (mTotal) mTotal.textContent = totalItems;
            if (mBaik) mBaik.textContent = kondisiBaik;
            if (mRusak) mRusak.textContent = perluPerhatian;

            // Render table
            if (data.length === 0) {
                inventarisBody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-on-surface-variant">Belum ada data inventaris.</td></tr>';
            } else {
                inventarisBody.innerHTML = data.map((item, index) => {
                    const isEven = index % 2 !== 0;
                    const bgClass = isEven ? 'bg-surface-container-lowest' : '';
                    
                    let conditionBadge = '';
                    if (item.kondisi === 'Baik') {
                        conditionBadge = '<span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[12px] font-bold">Baik</span>';
                    } else if (item.kondisi === 'Rusak') {
                        conditionBadge = '<span class="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[12px] font-bold">Rusak</span>';
                    } else {
                        conditionBadge = '<span class="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[12px] font-bold">Perlu Perhatian</span>';
                    }

                    return `
                    <tr class="${bgClass} hover:bg-surface-container-low transition-colors cursor-pointer" onclick="openModal('${item.nama}', '${item.jumlah}', '${item.kondisi}', '${item.lokasi || 'Ruang Kelas XII RPL'}', 'Tersedia', 'Inventaris Kelas XII RPL', '')">
                        <td class="px-6 py-4 font-semibold text-slate-800">${item.nama}</td>
                        <td class="px-6 py-4 text-slate-700">${item.jumlah}</td>
                        <td class="px-6 py-4">${conditionBadge}</td>
                        <td class="px-6 py-4 text-slate-600">${item.lokasi || 'Ruang Kelas XII RPL'}</td>
                        <td class="px-6 py-4"><span class="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-[12px]">Tersedia</span></td>
                    </tr>`;
                }).join('');
            }
        }
    }

    const absensiContainer = document.getElementById('absensi-container');
    const absensiBody = document.getElementById('absensi-table-body');
    const filterDate = document.getElementById('filter-date');
    if (absensiContainer && absensiBody && filterDate) {
        let absensiProfiles = [];
        let absensiData = [];
        let currentPage = 1;
        const limit = 10;
        
        // Set today's date if empty
        if (!filterDate.value) {
            filterDate.value = '2026-08-10';
        }

        const renderAbsensiTable = () => {
            // Count metrics
            let hadir = 0, izin = 0, sakit = 0, alpa = 0;
            
            // Map the data
            const mergedData = absensiProfiles.map(p => {
                const record = absensiData.find(a => a.profile_id === p.id || a.nomor_absen === p.nomor_absen);
                const status = record ? record.status : 'Hadir';
                let keterangan = record && record.keterangan && record.keterangan.trim() !== '' ? record.keterangan : '-';
                
                if (status === 'Hadir') hadir++;
                else if (status === 'Izin') izin++;
                else if (status === 'Sakit') sakit++;
                else if (status === 'Alpa') alpa++;
                
                return { ...p, status, keterangan };
            });
            
            // Update metrics
            const setMetric = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            setMetric('metric-hadir', hadir);
            setMetric('metric-izin', izin);
            setMetric('metric-sakit', sakit);
            setMetric('metric-alpa', alpa);
            
            // Render Table
            if (mergedData.length === 0) {
                absensiBody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-on-surface-variant italic">Belum ada data.</td></tr>';
            } else {
                absensiBody.innerHTML = mergedData.map((item, index) => {
                    const isEven = index % 2 !== 0;
                    const bgClass = isEven ? 'bg-surface-container-lowest' : '';
                    
                    let badge = '';
                    if (item.status === 'Hadir') badge = '<span class="px-3 py-1 bg-emerald-100 text-emerald-700 font-label-caps text-[10px] rounded-full">Hadir</span>';
                    else if (item.status === 'Izin') badge = '<span class="px-3 py-1 bg-indigo-100 text-indigo-700 font-label-caps text-[10px] rounded-full">Izin</span>';
                    else if (item.status === 'Sakit') badge = '<span class="px-3 py-1 bg-amber-100 text-amber-700 font-label-caps text-[10px] rounded-full">Sakit</span>';
                    else if (item.status === 'Alpa') badge = '<span class="px-3 py-1 bg-rose-100 text-rose-700 font-label-caps text-[10px] rounded-full">Alpa</span>';
                    
                    // Sanitize text (remove emojis and em-dashes)
                    const cleanKeterangan = item.keterangan.replace(/—/g, '-').replace(/[\u{1F300}-\u{1FAD7}]|[\u{2600}-\u{26FF}]/gu, '');
                    
                    return `
                    <tr class="${bgClass} hover:bg-surface-container-low transition-colors">
                        <td class="px-6 py-4 font-body-md text-on-surface">${item.nomor_absen}</td>
                        <td class="px-6 py-4 font-body-md text-on-surface font-semibold text-slate-800">${item.nama}</td>
                        <td class="px-6 py-4 text-center">${badge}</td>
                        <td class="px-6 py-4 font-body-md text-on-surface-variant ${cleanKeterangan === '-' ? 'opacity-60' : 'italic'}">${cleanKeterangan}</td>
                    </tr>`;
                }).join('');
            }
        };

        const loadAbsensi = async () => {
            absensiBody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-on-surface-variant italic">Memuat data absensi...</td></tr>';
            
            try {
                // Load profiles only once
                if (absensiProfiles.length === 0) {
                    const { data: pData, error: pError } = await window.supabaseClient.from('profiles').select('*').order('nomor_absen', { ascending: true });
                    if (pError) console.error('Error fetching profiles:', pError);
                    else absensiProfiles = pData || [];
                }
                
                const selectedDate = filterDate.value;
                const { data: aData, error: aError } = await window.supabaseClient.from('absensi').select('*').eq('tanggal', selectedDate);
                
                if (aError) {
                    console.error('Error fetching absensi:', aError);
                    absensiData = [];
                } else {
                    absensiData = aData || [];
                }
                
                currentPage = 1;
                renderAbsensiTable();
            } catch (err) {
                console.error('Exception in loadAbsensi:', err);
                absensiBody.innerHTML = `<tr><td colspan="4" class="px-6 py-8 text-center text-error italic">Gagal memuat data: ${err.message}</td></tr>`;
            }
        };

        filterDate.addEventListener('change', loadAbsensi);
        // Do not await, let it run concurrently
        loadAbsensi();
    }

    const jurnalTimelineBody = document.getElementById('jurnal-timeline-body');
    if (jurnalTimelineBody) {
        let jurnalData = [];
        let filteredJurnal = [];
        let jurnalPage = 1;
        const jurnalPerPage = 5;

        const jurnalSearch = document.getElementById('jurnal-search');
        const jurnalDate = document.getElementById('jurnal-date');
        const jurnalReset = document.getElementById('jurnal-reset');
        const btnJPrev = document.getElementById('jurnal-btn-prev');
        const btnJNext = document.getElementById('jurnal-btn-next');
        const pageInfoJ = document.getElementById('jurnal-pagination-info');
        const numbersContainerJ = document.getElementById('jurnal-pagination-numbers');

        const sanitizeText = (text) => {
            if (!text) return '';
            // Remove emojis and replace em-dash with hyphen
            return text
                .replace(/—/g, '-')
                .replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, '');
        };

        const getDayName = (dateStr) => {
            const date = new Date(dateStr);
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            return days[date.getDay()];
        };

        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return date.toLocaleDateString('id-ID', options);
        };

        const renderJurnal = () => {
            jurnalTimelineBody.innerHTML = '';
            
            if (filteredJurnal.length === 0) {
                jurnalTimelineBody.innerHTML = `<div class="flex items-center justify-center h-48"><span class="text-on-surface-variant italic">Tidak ada jurnal ditemukan.</span></div>`;
                pageInfoJ.textContent = 'Menampilkan 0-0 dari 0 jurnal';
                btnJPrev.disabled = true;
                btnJNext.disabled = true;
                numbersContainerJ.innerHTML = '';
                return;
            }

            const startIndex = (jurnalPage - 1) * jurnalPerPage;
            const endIndex = startIndex + jurnalPerPage;
            const currentJurnals = filteredJurnal.slice(startIndex, endIndex);

            currentJurnals.forEach(item => {
                const day = getDayName(item.tanggal);
                const fullDate = formatDate(item.tanggal);
                
                const title = sanitizeText(`${item.mata_pelajaran || '-'} - ${item.guru_pengajar || '-'}`);
                const materi = sanitizeText(`Materi: ${item.materi || '-'}`);
                const kegiatan = sanitizeText(item.deskripsi || '-');

                const cardHtml = `
                <div class="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border-l-4 border-primary flex flex-col md:flex-row gap-6 md:gap-8 items-start hover:shadow-md transition-shadow">
                    <div class="md:w-48 shrink-0">
                        <p class="font-headline-md text-slate-800 font-bold">${fullDate}</p>
                        <span class="font-label-caps text-slate-400 text-sm">${day}</span>
                    </div>
                    <div class="flex-grow space-y-4">
                        <div>
                            <h3 class="font-headline-md text-headline-md text-on-surface mb-1">${title}</h3>
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] text-primary">book</span>
                                <p class="font-body-md text-on-surface font-medium">${materi}</p>
                            </div>
                        </div>
                        <div class="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                            <h4 class="font-label-caps text-label-caps text-primary mb-2">Kegiatan</h4>
                            <p class="font-body-md text-on-surface-variant">${kegiatan}</p>
                        </div>
                    </div>
                </div>
                `;
                jurnalTimelineBody.insertAdjacentHTML('beforeend', cardHtml);
            });

            // Pagination UI
            const totalPages = Math.ceil(filteredJurnal.length / jurnalPerPage);
            pageInfoJ.textContent = `Menampilkan ${startIndex + 1}-${Math.min(endIndex, filteredJurnal.length)} dari ${filteredJurnal.length} jurnal`;
            btnJPrev.disabled = jurnalPage === 1;
            btnJNext.disabled = jurnalPage === totalPages;

            numbersContainerJ.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `w-8 h-8 rounded-lg font-label-caps text-[12px] flex items-center justify-center transition-all ${i === jurnalPage ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant hover:bg-surface-container-low'}`;
                btn.textContent = i;
                btn.onclick = () => {
                    jurnalPage = i;
                    renderJurnal();
                };
                numbersContainerJ.appendChild(btn);
            }
        };

        const filterData = () => {
            let sTerm = jurnalSearch ? jurnalSearch.value.toLowerCase() : '';
            let sDate = jurnalDate ? jurnalDate.value : '';

            filteredJurnal = jurnalData.filter(item => {
                let matchSearch = true;
                if (sTerm) {
                    const searchStr = `${item.mata_pelajaran || ''} ${item.nama_guru || ''} ${item.materi || ''}`.toLowerCase();
                    matchSearch = searchStr.includes(sTerm);
                }
                let matchDate = true;
                if (sDate) {
                    matchDate = item.tanggal === sDate;
                }
                return matchSearch && matchDate;
            });
            jurnalPage = 1;
            renderJurnal();
        };

        const loadJurnalData = async () => {
            try {
                const { data, error } = await window.supabaseClient.from('jurnal_kelas').select('*').order('tanggal', { ascending: false });
                if (error) {
                    console.error('Error fetching jurnal_kelas:', error);
                    jurnalTimelineBody.innerHTML = `<div class="flex items-center justify-center h-48"><span class="text-error italic">Gagal memuat jurnal. Error: ${error.message}</span></div>`;
                } else {
                    jurnalData = data || [];
                    filteredJurnal = [...jurnalData];
                    renderJurnal();
                }
            } catch (err) {
                console.error('Exception in loadJurnalData:', err);
                jurnalTimelineBody.innerHTML = `<div class="flex items-center justify-center h-48"><span class="text-error italic">Gagal memuat jurnal. Error: ${err.message}</span></div>`;
            }
        };

        if (jurnalSearch) jurnalSearch.addEventListener('input', filterData);
        if (jurnalDate) jurnalDate.addEventListener('change', filterData);
        if (jurnalReset) {
            jurnalReset.addEventListener('click', () => {
                if(jurnalSearch) jurnalSearch.value = '';
                if(jurnalDate) jurnalDate.value = '';
                filterData();
            });
        }
        
        if (btnJPrev) {
            btnJPrev.addEventListener('click', () => {
                if (jurnalPage > 1) {
                    jurnalPage--;
                    renderJurnal();
                }
            });
        }
        if (btnJNext) {
            btnJNext.addEventListener('click', () => {
                const totalPages = Math.ceil(filteredJurnal.length / jurnalPerPage);
                if (jurnalPage < totalPages) {
                    jurnalPage++;
                    renderJurnal();
                }
            });
        }

        // Do not await, let it run concurrently
        loadJurnalData();
    }

    // --- 6. Galeri ---
    const galeriContainer = document.getElementById('galeri-container');
    if (galeriContainer) {
        const { data, error } = await window.supabaseClient.from('galleries').select('*');
        if (error) console.error('Error:', error);
        else console.log('Galleries:', data);
    }
})();
