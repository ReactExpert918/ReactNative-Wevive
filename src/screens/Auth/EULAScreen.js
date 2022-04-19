import React, {Fragment, Component, useContext} from 'react';
import {Text, Image, View, ScrollView} from 'react-native';
import * as yup from 'yup';
import {Formik} from 'formik';
import Button from '../../components/Button';
import authStyles from '../../styles/auth';

import APIService from '../../service/APIService';
import AuthView from '../../views/AuthView';

import {CommonActions} from '@react-navigation/native';
import {responsiveWidth} from 'react-native-responsive-dimensions';
import HTML from 'react-native-render-html';
const termsAgree = require('../../images/PNG/terms_agree.png');
const termsInactive = require('../../images/PNG/terms_inactive.png');
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};
const EULA = `
<p><span style="font-weight: 400;">Wevive Holdings Ltd (&ldquo;Wevive&rdquo;) adopts leading edge end-to-end encryption to provide private messaging, Internet calling and other services to users worldwide. You agree to our Terms of Service (&ldquo;Terms&rdquo;) by installing or using our apps, services, or website (together, &ldquo;Services&rdquo;).</span></p>
<h3><strong>About our services</strong></h3>
<p><strong>Minimum Age.</strong><span style="font-weight: 400;"> You must be at least 13 years old to use our Services. The minimum age to use our Services without parental approval may be higher in your home country.</span></p>
<p><strong>Account Registration.</strong><span style="font-weight: 400;"> You must register your phone number in order to create an account with us. You agree to receive text messages and phone calls (from us or our third-party providers) with verification codes to register for our Services.</span></p>
<p><strong>Privacy of user data.</strong><span style="font-weight: 400;"> Wevive does not sell, rent or otherwise monetise your personal data or content.</span></p>
<p><span style="font-weight: 400;">Please read our Privacy Policy for details on how we protect the information you provide when using our Services. For the purpose of operating our Services, you agree to our data practices as described in our Privacy Policy as well as the transfer of your encrypted information and metadata to the United Kingdom and other countries where we have or use facilities, service providers or partners. Examples would be Third Party Providers sending you a verification code.</span></p>
<p><strong>Software.</strong><span style="font-weight: 400;"> In order to enable new features and enhanced functionality, you consent to downloading and installing updates to our Services.</span></p>
<p><strong>Fees and Taxes.</strong><span style="font-weight: 400;"> You are responsible for data and mobile carrier fees and taxes associated with the devices on which you use our Services.</span></p>
<h3><strong>Using Wevive&nbsp;</strong></h3>
<p><strong>Our Terms and Policies.</strong><span style="font-weight: 400;"> You must use our Services according to our Terms and Policies. If we disable your account for a violation of our Terms, you will not create another account without our permission.</span></p>
<p><strong>Legal and Acceptable Use.</strong><span style="font-weight: 400;"> You agree to use our Services only for legal and acceptable purposes. You will not use (or assist others in using) our Services in ways that: (a) violate or infringe the rights of Wevive, our users or others, including privacy, intellectual property or other proprietary rights; (b) involve sending illegal or forbidden communications such as bulk messaging, auto-messaging and auto-dialing. In order to report a suspected violation, please contact </span><a href="mailto:support@wevive.com"><span style="font-weight: 400;">support@wevive.com</span></a><span style="font-weight: 400;">.</span></p>
<p><strong>Harm to Wevive.</strong><span style="font-weight: 400;"> You must not (or assist others to) access, use, modify, distribute, transfer or exploit our Services in unauthorised manners, or in ways that harm Wevive, our Services or systems, including but not limited to: you must not (a) gain or try to gain unauthorised access to our Services or systems; (b) disrupt the integrity or performance of our Services; (c) create accounts for our Services through unauthorised or automated means; (d) collect information about our users in any unauthorised manner; or (e) sell, rent or charge for our Services.</span></p>
<p><strong>Account Security.</strong><span style="font-weight: 400;"> We do not have the ability to access your messages. You are responsible for keeping your device and your Wevive account safe and secure. If you lose your phone, follow the steps on our Support site to re-register for our Services. When you register with a new device, your old device will stop receiving all messages and calls.</span></p>
<p><strong>No Access to Emergency Services.</strong><span style="font-weight: 400;"> Our Services do not provide access to emergency service providers like the police, fire department, hospitals or other public safety organisations.&nbsp;</span></p>
<p><strong>Third-party services.</strong><span style="font-weight: 400;"> Our Services may allow you to access, use or interact with third-party websites, apps, content and other products and services. When you use third-party services, their terms and privacy policies govern your use of those services.</span></p>
<h3><strong>Your Rights with Wevive</strong></h3>
<p><strong>Your Rights.</strong><span style="font-weight: 400;"> You own the information you submit through our Services. You must have the rights to the phone number you use to sign up for your Wevive account.</span></p>
<p><strong>Wevive&rsquo;s Rights.</strong><span style="font-weight: 400;"> We own all copyrights, trademarks, domains, logos, trade dress, trade secrets, patents, and other intellectual property rights associated with our Services. You may not use our copyrights, trademarks, domains, logos, trade dress, patents, and other intellectual property rights unless you have our written permission. To report copyright, trademark, or other intellectual property infringement, please contact </span><span style="font-weight: 400;">support@wevive.com.</span></p>
<p>&nbsp;</p>
<p><strong>Your license with Wevive</strong></p>
<p><strong>Wevive&rsquo;s License to You.</strong><span style="font-weight: 400;"> Wevive grants you a limited, revocable, non-exclusive, and non-transferable license to use our Services in accordance with these Terms.</span></p>
<h3><strong>Disclaimers and Limitations</strong></h3>
<p><strong>Disclaimers.</strong><span style="font-weight: 400;"> YOU USE OUR SERVICES AT YOUR OWN RISK AND SUBJECT TO THE FOLLOWING DISCLAIMERS. WE PROVIDE OUR SERVICES ON AN &ldquo;AS IS&rdquo; BASIS WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND FREEDOM FROM COMPUTER VIRUS OR OTHER HARMFUL CODE. WEVIVE DOES NOT WARRANT THAT ANY INFORMATION PROVIDED BY US IS ACCURATE, COMPLETE, OR USEFUL, THAT OUR SERVICES WILL BE OPERATIONAL, ERROR-FREE, SECURE, OR SAFE, OR THAT OUR SERVICES WILL FUNCTION WITHOUT DISRUPTIONS, DELAYS, OR IMPERFECTIONS. WE DO NOT CONTROL, AND ARE NOT RESPONSIBLE FOR, CONTROLLING HOW OR WHEN OUR USERS USE OUR SERVICES. WE ARE NOT RESPONSIBLE FOR THE ACTIONS OR INFORMATION (INCLUDING CONTENT) OF OUR USERS OR OTHER THIRD PARTIES. YOU RELEASE US, AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, PARTNERS, AND AGENTS (TOGETHER, &ldquo;WEVIVE PARTIES&rdquo;) FROM ANY CLAIM, COMPLAINT, CAUSE OF ACTION, CONTROVERSY, OR DISPUTE (TOGETHER, &ldquo;CLAIM&rdquo;) AND DAMAGES, KNOWN AND UNKNOWN, RELATING TO, ARISING OUT OF, OR IN ANY WAY CONNECTED WITH ANY SUCH CLAIM YOU HAVE AGAINST ANY THIRD PARTIES.</span></p>
<p><strong>Limitation of liability.</strong><span style="font-weight: 400;"> THE WEVIVE PARTIES WILL NOT BE LIABLE TO YOU FOR ANY LOST PROFITS OR CONSEQUENTIAL, SPECIAL, PUNITIVE, INDIRECT, OR INCIDENTAL DAMAGES RELATING TO, ARISING OUT OF, OR IN ANY WAY IN CONNECTION WITH OUR TERMS, US, OR OUR SERVICES, EVEN IF THE WEVIVE PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY RELATING TO, ARISING OUT OF, OR IN ANY WAY IN CONNECTION WITH OUR TERMS, US, OR OUR SERVICES WILL NOT EXCEED ONE HUNDRED POUNDS (&pound;100). THE FOREGOING DISCLAIMER OF CERTAIN DAMAGES AND LIMITATION OF LIABILITY WILL APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW. THE LAWS OF SOME STATES OR JURISDICTIONS MAY NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU. NOTWITHSTANDING ANYTHING TO THE CONTRARY IN OUR TERMS, IN SUCH CASES, THE LIABILITY OF THE WEVIVE PARTIES WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW.</span></p>
<p><strong>Availability of Our Services.</strong><span style="font-weight: 400;"> Our Services may be interrupted, including for maintenance, upgrades, or network or equipment failures. We may discontinue some or all of our Services, including certain features and the support for certain devices and platforms, at any time.</span></p>
<h3><strong>Resolving Disputes and Ending Terms</strong></h3>
<p><strong>Resolving disputes.</strong><span style="font-weight: 400;"> The laws of England govern our Terms, as well as any disputes, whether in court or arbitration, which might arise between Wevive and you, without regard to conflict of law provisions.</span></p>
<p><strong>Ending these Terms.</strong><span style="font-weight: 400;"> You may end these Terms with Wevivel at any time by deleting the Wevive application from your device and discontinuing use of our Services. We may modify, suspend or terminate your access to or use of our Services anytime for any reason, such as if you violate the letter or spirit of our Terms or create harm, risk, or possible legal exposure for Wevive. The following provisions will survive termination of your relationship with Wevive: &ldquo;Licenses,&rdquo; &ldquo;Disclaimers,&rdquo; &ldquo;Limitation of Liability,&rdquo; &ldquo;Resolving dispute,&rdquo; &ldquo;Availability&rdquo; and &ldquo;Ending these Terms,&rdquo; and &ldquo;General&rdquo;.</span></p>
<h3><strong>General</strong></h3>
<p><span style="font-weight: 400;">Wevive may update the Terms from time to time. When we update our Terms, we will update the &ldquo;Last Modified&rdquo; date associated with the updated Terms. Your continued use of our Services confirms your acceptance of our updated Terms and supersedes any prior Terms. You will comply with all applicable export control and trade sanctions laws. Our Terms cover the entire agreement between you and Wevive regarding our Services. If you do not agree with our Terms, you should stop using our Services.</span></p>
<p><span style="font-weight: 400;">If we fail to enforce any of our Terms, that does not mean we waive the right to enforce them. If any provision of the Terms is deemed unlawful, void, or unenforceable, that provision shall be deemed severable from our Terms and shall not affect the enforceability of the remaining provisions. Our Services are not intended for distribution to or use in any country where such distribution or use would violate local law or would subject us to any regulations in another country. We reserve the right to limit our Services in any country. If you have specific questions about these Terms, please contact us at support@wevive.com.</span></p>
<h1 style="color: #5e9ca0;">&nbsp;</h1>
<p><span style="font-weight: 400;">Effective as of May 10, 2020</span></p>
`;
export default class EULAScreen extends Component {
  navigateSuccess = () => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {name: 'PINScreen', params: {user: this.props.route.params.user}},
        ],
      }),
    );
  };
  state = {
    read: false,
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
      <AuthView
        headline=""
        route={this.props.route}
        navigation={this.props.navigation}>
        <Formik
          initialValues={{
            pin: '',
          }}
          onSubmit={(values, actions) => {
            this.navigateSuccess();
          }}
          validationSchema={yup.object().shape({
            //email: yup.string().email().required(),
            //password: yup.string().min(3).required(),
          })}>
          {({
            values,
            handleChange,
            errors,
            setFieldTouched,
            touched,
            isValid,
            handleSubmit,
            setFieldValue,
          }) => (
            <View>
              <Text style={styles.pageHeadlineStyle}>
                End-user License Agreement
              </Text>
              {!this.state.read ? (
                <Image source={termsInactive} style={styles.termsIcon} />
              ) : (
                <Image source={termsAgree} style={styles.termsIcon} />
              )}
              <ScrollView
                style={styles.eulaContainer}
                onScroll={({nativeEvent}) => {
                  if (isCloseToBottom(nativeEvent)) {
                    this.setState({read: true});
                  }
                }}
                scrollEventThrottle={100}>
                <HTML
                  source={{html: EULA}}
                  contentWidth={responsiveWidth(80)}
                />
              </ScrollView>
              <View style={{...styles.buttonContainerStyle, margin: 0}}>
                <Button
                  onPress={handleSubmit}
                  title="Accept"
                  active={this.state.read}
                />
              </View>
            </View>
          )}
        </Formik>
      </AuthView>
    );
  }
}

const styles = authStyles();
