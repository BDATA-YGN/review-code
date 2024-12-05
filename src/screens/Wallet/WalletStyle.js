import {StyleSheet} from 'react-native';
import COLOR from '../../constants/COLOR';
import SPACING from '../../constants/SPACING';
import {FontFamily, fontSizes} from '../../constants/FONT';
import RADIUS from '../../constants/RADIUS';
import PIXEL from '../../constants/PIXEL';

export const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: COLOR.Grey50,
  },
  DsafeAreaView: {
    flex: 1,
    backgroundColor: COLOR.DarkTheme,
  },
  card: {
    width: '95%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.White100,
    margin: SPACING.sp10,
    padding: SPACING.md,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  Dcard: {
    width: '95%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkThemLight,
    margin: SPACING.sp10,
    padding: SPACING.md,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  iconCard: {
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.Grey50,
    flex: 1,
    padding: SPACING.sp10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  DiconCard: {
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkFadeLight,
    flex: 1,
    padding: SPACING.sp10,

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: COLOR.Primary,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    marginTop: SPACING.sp10,
  },
  DiconText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size13,
    marginTop: SPACING.sp10,
  },
  current: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  Dcurrent: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size16,
  },
  balance: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
  },
  Dbalance: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size18,
  },
  successCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: '#D4F3D5',
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },

  proCard : {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.Orange50,
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  proText : {
    color: COLOR.Orange300,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  dateText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  DdateText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  textCard: {
    width: '100%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.Grey50,
    // margin: SPACING.sp10,
    padding: SPACING.md,
  },
  DtextCard: {
    width: '100%',
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.DarkFadeLight,
    // margin: SPACING.sp10,
    padding: SPACING.md,
  },
  titleText: {
    color: COLOR.Grey500,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  DtitleText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  purchaseCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: '#FBD4D4',
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  purchaseText: {
    color: '#FF0000',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  sentCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: '#D9EBF9',
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  sentText: {
    color: '#2196F3',
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  saleCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.Grey50,
    // margin: SPACING.sp10,
    paddingVertical: SPACING.sp3,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLOR.White100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalText: {
    fontSize: fontSizes.size16,
    fontFamily: FontFamily.PoppinSemiBold,
  },
  outlineButton: {
    width: '45%',
    padding: 5,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.rd5,
    borderCurve: 'continuous',
    alignItems: 'center',
  },
  outlineButtonText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: PIXEL.px15,
  },
  flexRowWrap: {
    gap: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
  },
  timeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.White,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex: 0.5,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  DtimeCard: {
    borderRadius: RADIUS.rd7,
    backgroundColor: COLOR.DarkFadeLight,
    borderColor: COLOR.Grey100,
    borderWidth: 1,
    flex: 0.5,
    // paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  timeText: {
    fontFamily: FontFamily.PoppinRegular,
    fontSize: fontSizes.size15,
  },
  noText: {
    color: COLOR.Grey300,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
  DnoText: {
    color: COLOR.White100,
    fontFamily: FontFamily.PoppinSemiBold,
    fontSize: fontSizes.size16,
  },
});
