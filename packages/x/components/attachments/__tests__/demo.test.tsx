import { Button } from 'antd';
import React from 'react';
import demoTest, { rootPropsTest } from '../../../tests/shared/demoTest';

demoTest('attachments');

rootPropsTest(['attachments', 'silent'], (Attachments, props) => (
  <Attachments {...props}>
    <Button />
  </Attachments>
));
