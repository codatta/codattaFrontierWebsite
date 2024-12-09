import { Col, Form, InputNumber, Row } from 'antd'

import useImageLabelStore, { updateRect } from '@/stores/image-label-store'

export default function CoordinateInput() {
  const { rect } = useImageLabelStore()

  return (
    <>
      <div className="text-white">
        <h2 className="text-base">2. Make annotations on the image.</h2>
        <ul className="list-disc pl-4 text-gray-400">
          <li>
            Mark the contact area on the response image using the focus point.
          </li>
          <li>Adjust the angle by moving the arrow.</li>
        </ul>
      </div>
      <Row gutter={16} className="hidden">
        <Col span={8}>
          <Form.Item
            label={<span className="text-white">X Coordinate</span>}
            rules={[{ required: true, message: 'X coordinate is required' }]}
            name="x"
            initialValue={rect.x}
          >
            <InputNumber
              addonBefore={<span className="text-white">0</span>}
              addonAfter={<span className="text-white">1</span>}
              min={0}
              max={1}
              value={rect.x}
              step={0.01}
              placeholder="0.50"
              style={{ width: '90%' }}
              onChange={(value) => {
                if (value !== null) {
                  updateRect({ x: value })
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<span className="text-white">Y Coordinate</span>}
            rules={[{ required: true, message: 'Y coordinate is required' }]}
            name="y"
            initialValue={rect.y}
          >
            <InputNumber
              addonBefore={<span className="text-white">0</span>}
              addonAfter={<span className="text-white">1</span>}
              min={0}
              max={1}
              value={rect.y}
              step={0.01}
              placeholder="0.50"
              style={{ width: '90%' }}
              onChange={(value) => {
                if (value !== null) {
                  updateRect({ y: value })
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<span className="text-white">Angle</span>}
            rules={[{ required: true, message: 'Angle is required' }]}
            name="angle"
            initialValue={rect.angle}
          >
            <InputNumber
              addonBefore={<span className="text-white">-180</span>}
              addonAfter={<span className="text-white">180</span>}
              min={-180}
              max={180}
              step={1}
              value={-rect.angle}
              placeholder="0"
              style={{ width: '90%' }}
              onChange={(value) => {
                if (value !== null) {
                  updateRect({ angle: -value })
                }
              }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label={<span className="text-white">Radius</span>}
            rules={[{ required: true, message: 'Radius is required' }]}
            name="radius"
            initialValue={rect.radius}
          >
            <InputNumber
              // addonBefore={<span className="text-white">12</span>}
              // addonAfter={<span className="text-white">200</span>}
              // min={12}
              // max={200}
              // step={1}
              value={rect.radius}
              placeholder="0"
              style={{ width: '90%' }}
              onChange={(value) => {
                if (value !== null) {
                  updateRect({ radius: value })
                }
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
