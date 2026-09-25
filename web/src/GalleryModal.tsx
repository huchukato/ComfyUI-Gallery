import Modal from 'antd/es/modal/Modal';
import Layout from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { useRef, useState } from 'react';
import { useGalleryContext } from './GalleryContext';
import GalleryHeader from './GalleryHeader';
import GallerySidebar from './GallerySidebar';
import GalleryImageGrid from './GalleryImageGrid';
import GallerySettingsModal from './GallerySettingsModal';
import { BASE_Z_INDEX } from './ComfyAppApi';

const GalleryModal = () => {
    const { open, setOpen, size, showSettings, siderCollapsed, setSiderCollapsed } = useGalleryContext();
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);

    // Drag the whole modal by its title bar — skip clicks on interactive
    // elements so the search box, buttons and sort control keep working.
    const onHeaderMouseDown = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.closest('button, input, a, .ant-segmented, .ant-select, .ant-popconfirm, [role="button"]')) {
            return;
        }
        dragging.current = true;
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = offset.x;
        const origY = offset.y;
        const onMove = (ev: MouseEvent) => {
            if (!dragging.current) return;
            setOffset({ x: origX + ev.clientX - startX, y: origY + ev.clientY - startY });
        };
        const onUp = () => {
            dragging.current = false;
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    };

    return (
        <>
        <Modal
            zIndex={BASE_Z_INDEX}
            title={
                <div
                    onMouseDown={onHeaderMouseDown}
                    style={{ cursor: 'grab', userSelect: 'none' }}
                    title="Drag to move the gallery"
                >
                    <GalleryHeader />
                </div>
            }
            centered
            open={open}
            afterOpenChange={setOpen}
            onOk={() => setOpen(false)}
            onCancel={() => setOpen(false)}
            width={Math.floor((size?.width || 1440) * 0.6)}
            footer={null}
            mask={false}
            styles={{
                content: {
                    resize: 'both',
                    overflow: 'hidden',
                    minWidth: 480,
                    minHeight: 360,
                    height: '72vh',
                },
                body: {
                    height: 'calc(100% - 110px)',
                    overflow: 'hidden',
                },
            }}
            modalRender={(modal) => (
                <div style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>
                    {modal}
                </div>
            )}
        >
            <Layout 
                style={{ 
                    borderRadius: 8, 
                    overflowX: "hidden", 
                    overflowY: "auto", 
                    width: '100%', 
                    height: "100%" 
                }}
            >
                <Sider 
                    collapsed={siderCollapsed}
                    collapsedWidth={0}
                    width="20%" 
                    style={{ 
                        overflow: 'auto', 
                        position: 'sticky', 
                        insetInlineStart: 0, 
                        top: 0, 
                        bottom: 0, 
                        scrollbarWidth: 'thin', 
                        scrollbarGutter: 'stable', 
                        background: "transparent" 
                    }}
                >
                    <GallerySidebar />
                </Sider>
                <GalleryImageGrid />
            </Layout>
        </Modal>
            {showSettings && <GallerySettingsModal />}
        </>
    );
};

export default GalleryModal;
