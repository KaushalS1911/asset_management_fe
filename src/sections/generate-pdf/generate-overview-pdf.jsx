import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Font, Document, Text, StyleSheet, Image } from '@react-pdf/renderer';
import logo from '../../assets/logo/jbs.png';
import { fDate, fDateTime } from '../../utils/format-time';

Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf' },
  ],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: '700' },
        h4: { fontSize: 13, fontWeight: '700' },
        h5: { fontSize: 10, fontWeight: '700' },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: '700' },
        subtitle2: { fontSize: 9, fontWeight: '700' },
        alignRight: { textAlign: 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          padding: '40px 24px 120px 24px',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },
        gridContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    [],
  );

const getNestedValue = (obj, path) => {
  if (!path || typeof path !== 'string') {
    return undefined;
  }
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

const GenerateOverviewPdf = ({ orientation, heading, allData, configs, SubHeading, fieldMapping }) => {
  const styles = useStyles();
  const getFormattedValue = (hed, row, fieldMapping) => {
    switch (hed.hed) {
        case 'Warranty start':
        return fDate(row?.warranty_start_date) || '-';
        case 'Warranty end':
        return fDate(row?.warranty_end_date) || '-';
        case 'Start Date':
        return fDate(row?.start_date) || '-';
        case 'End Date':
        return fDate(row?.end_date) || '-';
        case 'Asset Name':
        return row?.asset?.asset_name;
        case 'Asset Type':
        return row?.asset?.asset_type;
      default:
        return getNestedValue(row, fieldMapping[hed.hed]) || '-';
    }
  };

  const ListingDetails = (
    <View>
      <Text style={{ fontSize: '15px', fontWeight: '700', margin: '10px 0px 0px 0px' }}>
        {SubHeading}
      </Text>
      <View style={{ margin: '8px 0px' }}>
        <View style={{
          flexDirection: 'row',
          borderTop: '2px solid #E6E6E6',
          borderBottom: '2px solid #E6E6E6',
          padding: '8px 0px',
        }}>
          {heading?.map((hed, index) => (
            <View key={index} style={{ width: hed.Size, textAlign: 'center' }}>
              <Text style={{ fontSize: '8px', fontWeight: '600' }}>{hed.hed}</Text>
            </View>
          ))}
        </View>
        <View>
          {allData?.map((row, index) => (
            <View key={index} style={{ flexDirection: 'row', padding: '6px 0px' }}>
              {heading?.map((hed, idx) => (
                <View key={idx} style={{ width: hed.Size, textAlign: 'center' }}>
                  <Text style={{ fontSize: '8px' }}>
                    {getFormattedValue(hed, row, fieldMapping)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size='A4' orientation={orientation} style={styles.page}>
        <View style={{ padding: '10px', backgroundColor: '#F6F6F6' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Image source={configs?.company_details?.logo || logo}
                   style={{ width: 60, height: 60, borderRadius: '5px' }} />
            <View style={{ flex: 1, textAlign: 'center' }}>
              <Text style={{ fontWeight: '700', fontSize: '18px' }}>{configs?.company_details?.name}</Text>
              <Text style={{ fontWeight: '400', fontSize: '8px' }}>{configs?.company_details?.address_1}</Text>
            </View>
          </View>
        </View>
        <View style={{ margin: '5px 0px' }}>{ListingDetails}</View>
      </Page>
    </Document>
  );
};

GenerateOverviewPdf.propTypes = {
  orientation: PropTypes.string.isRequired,
  heading: PropTypes.arrayOf(
    PropTypes.shape({
      hed: PropTypes.string.isRequired,
      Size: PropTypes.string.isRequired,
    }),
  ).isRequired,
  allData: PropTypes.array.isRequired,
  configs: PropTypes.object.isRequired,
  SubHeading: PropTypes.string.isRequired,
  fieldMapping: PropTypes.object.isRequired,
};

export default GenerateOverviewPdf;
